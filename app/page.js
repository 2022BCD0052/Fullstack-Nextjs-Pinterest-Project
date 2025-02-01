// pages/index.js or your Home component
"use client";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { ClipLoader } from "react-spinners";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import { Suspense } from "react";
import SearchParamsWrapper from "./components/SearchParamsWrapper";

const HomeContent = () => {
  const { data: session } = useSession();
  const [pins, setPins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getPins = useCallback(async (search) => {
    if (!session) return; // Only fetch pins if session is available
    setLoading(true);
    setError(null); // Reset error state before the request
    const url = search
      ? `http://localhost:3000/api/pin?search=${search}`
      : "http://localhost:3000/api/pin";
    try {
      const response = await axios.get(url);
      if (Array.isArray(response.data.pins)) {
        setPins(response.data.pins);
      } else {
        setPins([]); // If the response isn't the expected structure, set pins to an empty array
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch pins");
      toast.error("Failed to fetch pins");
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      getPins();
    }
  }, [session, getPins]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const search = searchParams.get("search");
    if (search) {
      getPins(search);
    }
  }, [getPins]);

  return (
    <SearchParamsWrapper>
      {(searchParams) => {
        const search = searchParams?.get("search");

        return (
          <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 py-2">
            <div className="container mx-auto p-4">
              {loading ? (
                <div className="flex justify-center items-center min-h-[750px]">
                  <ClipLoader color="#ef4444" size={120} />
                </div>
              ) : error ? (
                <h3 className="min-h-[750px] flex justify-center items-center text-red-500 text-4xl font-semibold">
                  {error}
                </h3>
              ) : pins.length === 0 ? (
                <h3 className="min-h-[750px] flex justify-center items-center text-red-500 text-4xl font-semibold">
                  No results found for your search.
                </h3>
              ) : (
                <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
                  {pins.map((item) => (
                    <Link
                      href={`/pin/${item._id}`}
                      key={item._id}
                      className="relative mb-4 group"
                    >
                      <Image
                        src={item?.image?.url}
                        alt={item.title}
                        height={300}
                        width={300}
                        className="w-full h-auto rounded-lg py-1"
                        priority
                      />
                      <span className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      }}
    </SearchParamsWrapper>
  );
};

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
