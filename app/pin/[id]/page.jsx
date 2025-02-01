"use client";
import Comment from "@/app/components/Comment";
import axios from "axios";
import { Heart, Send } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

const Pin = () => {
  const [comment, setComment] = useState("");
  const [pin, setPin] = useState({});
  const [morePins, setMorePins] = useState([]);
  const [isLiked, setIsLiked] = useState(false);

  const { id } = useParams();
  const { data: session } = useSession();

  const fetchMorePins = async () => {
    const response = await axios.get("http://localhost:3000/api/pin");
    setMorePins(response.data.pins);
  };

  const fetchPin = async () => {
    const response = await axios.get(`http://localhost:3000/api/pin/${id}`);
    setPin(response.data.pin);
    const pinLiked = response.data.pin.likes.some(
      (element) => session?.user?.name === element.user
    );
    if (pinLiked) {
      setIsLiked(true);
    } else {
      setIsLiked(false);
    }
  };

  const handlePostComment = async () => {
    if (session && session?.user) {
      const profileImage = session?.user?.image;
      const user = session?.user?.name;

      if (!comment || !profileImage || !user) {
        toast.error("Please add a comment");
        return;
      }
      try {
        const formData = new FormData();
        formData.append("user", user);
        formData.append("comment", comment);
        formData.append("profileImage", profileImage);

        const res = await axios.post(
          `http://localhost:3000/api/comments/${id}`,
          formData,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        if (res.status === 201) {
          toast.success(res.data.message);
          fetchPin();
          setComment("");
        }
      } catch (error) {
        toast.error(error.response.data.error);
      }
    }
  };

  const handleLikePin = async () => {
    const response = await axios.post(
      `http://localhost:3000/api/like/${id}`,
      "",
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    if (response.status === 201) {
      toast.success(response.data.message);
      fetchPin();
    } else if (response.status === 200) {
      toast.success(response.data.message);
      fetchPin();
    } else {
      toast.error("Internal server error");
    }
  };

  useEffect(() => {
    fetchPin();
    fetchMorePins();
  }, [id]);

  return (
    <>
      {pin && pin?.image?.url && morePins ? (
        <div className="min-h-screen bg-gradient-to-r from-black via-gray-800 to-gray-900  py-8">
          <div className="container mx-auto px-4">
            {/* Pin Image Section */}
            <div className="flex justify-center mb-8 relative group">
  <div className="rounded-xl overflow-hidden max-w-[30%] w-full md:h-[70%] lg:h-[40%] bg-transparent shadow-2xl transform transition-all hover:shadow-2xl">
    <Image
      src={pin?.image?.url}
      alt="Pin"
      className="rounded-xl shadow-lg object-cover w-full max-w-3xl h-full group-hover:opacity-80 transition-opacity"
      width={1000}
      height={600}
      priority={true}
    />
    <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-black opacity-30 group-hover:opacity-50 transition-opacity"></div>
  </div>
</div>



            {/* Pin Details Section */}
            <div className="max-w-4xl mx-auto text-white mt-10">
              <div className="flex justify-between items-center mb-6">
                <Heart
                  onClick={handleLikePin}
                  className={`${
                    isLiked
                      ? "bg-red-500 text-white hover:bg-red-700"
                      : "bg-transparent hover:bg-red-500"
                  } transition-all duration-300 w-14 h-14 p-3 rounded-full cursor-pointer shadow-xl transform hover:rotate-12 hover:scale-110`}
                />
                <Link
                  href={pin?.image?.url}
                  target="_blank"
                  className="bg-red-500 text-white px-8 py-4 rounded-lg font-semibold shadow-lg transition-all hover:bg-red-600 hover:scale-105"
                >
                  Download
                </Link>
              </div>
              <p className="text-gray-400 text-lg">
                {pin?.likes?.length <= 1
                  ? `${pin?.likes?.length} Like`
                  : `${pin?.likes?.length} Likes`}
              </p>

              {/* Comments Section */}
              <div className="mt-6">
                <h3 className="text-2xl font-bold mb-4">Comments</h3>
                <div className="max-h-96 overflow-auto space-y-4">
                  {pin?.comments?.length > 0 ? (
                    pin.comments.map((element) => (
                      <Comment
                        key={element._id}
                        user={element.user}
                        comment={element.comment}
                        profileImage={element.profileImage}
                      />
                    ))
                  ) : (
                    <p className="font-semibold text-lg text-gray-500">
                      No Comments Yet!
                    </p>
                  )}
                </div>
                <div className="mt-6 relative">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="w-full bg-gray-800 p-4 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                  <Send
                    onClick={handlePostComment}
                    className="absolute right-4 top-4 text-red-500 cursor-pointer hover:text-red-600 transition"
                  />
                </div>
              </div>
            </div>

            {/* More Pins Section */}
            <div className="mt-12">
              <h3 className="text-3xl font-semibold text-white">
                More to Explore
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
                {morePins &&
                  morePins.map((element) => (
                    <Link
                      href={`/pin/${element._id}`}
                      key={element._id}
                      className="relative rounded-lg overflow-hidden group transform hover:scale-105 transition-all duration-300"
                    >
                      <div className="shadow-xl hover:scale-110 hover:rotate-3 transition-all">
                        <Image
                          width={500}
                          height={500}
                          src={element?.image?.url}
                          alt={"Pin"}
                          className="w-full h-48 object-cover"
                          priority={true}
                        />
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-40 text-white p-3 transition-all">
                        <p className="text-lg font-semibold">{element.title}</p>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center min-h-[750px]">
          <ClipLoader color="#ef4444" size={120} />
        </div>
      )}
    </>
  );
};

export default Pin;
