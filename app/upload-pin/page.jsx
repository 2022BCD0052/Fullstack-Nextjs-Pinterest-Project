"use client";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import { ArrowUpFromLine } from "lucide-react";
import { ClipLoader } from "react-spinners";

const UploadPin = () => {
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState("");

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };

  const { data: session } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image || !title || !description || !tags) {
      toast.error("Please provide complete details of your pin.");
      return;
    }
    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("tags", tags);
    if (session) {
      const user = session?.user?.name;
      formData.append("user", user);
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3000/api/pin",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setLoading(false);
      setImage("");
      setImagePreview("");
      setTitle("");
      setDescription("");
      setTags("");
      if (response.status === 201) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error("Error while uploading pin, try again.");
    }
  };

  return (
    <>
      <div className="mx-auto  flex flex-col min-h-screen px-5 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
        <h2 className="text-center   text-5xl font-extrabold py-8 text-gradient animate-gradient-x">
          Upload   Image
        </h2>
        <div className="w-full mx-auto max-w-[1024px] gap-5 py-7">
          <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-10">
            <div
              className="bg-transparent hover:cursor-pointer w-full sm:w-[380px] flex items-center justify-center relative rounded-[20px] min-h-[450px] border-4 border-dashed border-gray-500 hover:border-indigo-500 transition-all duration-500 shadow-xl transform hover:scale-105 hover:rotate-1"
              onClick={() => document.getElementById("fileInput").click()}
            >
              <input
                type="file"
                id="fileInput"
                className="hidden"
                onChange={handleImage}
              />
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt={"ImagePreview"}
                  className="rounded-[20px] w-full object-cover"
                  width={400}
                  height={400}
                />
              ) : (
                <>
                  <div className="flex flex-col items-center gap-5 text-gray-300">
                    <ArrowUpFromLine className="bg-gradient-to-r from-pink-500 to-teal-500 w-[38px] h-[38px] p-[6px] text-white rounded-full shadow-lg transform transition-all duration-500 hover:scale-125 hover:rotate-12" />
                    <p className="text-lg font-semibold">Choose a file or drag and drop it here</p>
                  </div>
                  <div className="absolute bottom-5 text-center px-5 text-sm">
                    <p className="text-gray-300">We recommend high-quality images less than 10MB.</p>
                  </div>
                </>
              )}
            </div>

            <div className="w-full sm:w-[450px] flex flex-col justify-center gap-5 p-5 backdrop-blur-lg bg-white/10 border-2 border-gradient-to-r from-purple-500 to-indigo-500 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-500">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2 text-lg">
                  <label className="font-bold text-gray-100">Title</label>
                  <input
                    type="text"
                    className="focus:outline-none p-3 bg-transparent border-2 border-purple-500 rounded-[8px] text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                    placeholder="Add a title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2 text-lg">
                  <label className="font-bold text-gray-100">Description</label>
                  <textarea
                    rows={4}
                    className="focus:outline-none p-3 bg-transparent border-2 border-purple-500 rounded-[8px] text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                    placeholder="Add a description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="flex flex-col gap-2 text-lg">
                  <label className="font-bold text-gray-100">Tags</label>
                  <input
                    type="text"
                    className="focus:outline-none p-3 bg-transparent border-2 border-purple-500 rounded-[8px] text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
                    placeholder="e.g., Anime, Naruto, OnePiece"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </div>

                <button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-lg p-4 text-[18px] font-bold flex items-center justify-center gap-3 shadow-lg hover:scale-105 hover:from-indigo-600 hover:to-purple-700 transition-all duration-500"
                >
                  {loading ? (
                    <ClipLoader color="#fff" size={20} />
                  ) : (
                    "Upload Pin"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadPin;
