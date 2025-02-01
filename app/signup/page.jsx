"use client";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

const SignUp = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImage(file);
      setImagePreview(reader.result);
    };
  };

  const handleUserRegister = async () => {
    setLoading(true);
    if (!username || !email || !password || !image) {
      toast.error("Please provide complete details.");
      setLoading(false);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("image", image);
      await axios.post("http://localhost:3000/api/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUsername("");
      setEmail("");
      setPassword("");
      setImagePreview("");
      setImage("");
      setLoading(false);
      router.push("/signin");
    } catch (error) {
      toast.error("Registration failed, try again.");
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <>
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-black via-gray-800 to-gray-900 fixed top-0 left-0 w-full px-4 sm:px-6">
        <div className="relative p-6 sm:p-12 rounded-3xl shadow-xl w-full max-w-sm sm:max-w-md transform transition duration-700 hover:scale-105 hover:shadow-2xl bg-black bg-opacity-40 backdrop-blur-md border border-cyan-500 border-opacity-50">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-pink-500 to-cyan-400 opacity-20 blur-2xl pointer-events-none"></div>
        <div className="flex justify-center mb-6 relative z-10">
            <Image
              src="/pinterest.svg"
              alt="Pinterest Logo"
              height={100}
              width={100}
              priority
              className="w-14 h-14 sm:w-16 sm:h-16 animate-pulse"
            />
          </div>
          <h2 className="text-center text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400 mb-4">
            Join Pinterest
          </h2>
          <p className="text-center text-gray-300 mb-6 text-sm sm:text-base">
            Discover futuristic inspiration with one click
          </p>

          {/* Input Fields */}
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 sm:p-4 border-2 border-transparent bg-transparent text-white rounded-lg mb-3 sm:mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50 transform hover:scale-105 transition duration-300"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-3 sm:p-4 border-2 border-transparent bg-transparent text-white rounded-lg mb-3 sm:mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50 transform hover:scale-105 transition duration-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 sm:p-4 border-2 border-transparent bg-transparent text-white rounded-lg mb-3 sm:mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50 transform hover:scale-105 transition duration-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Avatar Selection */}
          <div className="flex items-center space-x-4 mb-6">
            <Image
              src={imagePreview ? imagePreview : "/avatar.png"}
              alt="User Avatar"
              width={100}
              height={100}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-cyan-400 animate-pulse"
            />
            <label className="bg-cyan-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg cursor-pointer hover:bg-cyan-700 transition-all">
              Choose Avatar
              <input type="file" className="hidden" onChange={handleImage} />
            </label>
          </div>

          {/* SignUp Button */}
          <button
            onClick={handleUserRegister}
            className="w-full p-3 sm:p-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold rounded-lg mb-4 sm:mb-6 transform transition-all hover:scale-110 hover:shadow-2xl hover:rotate-3"
          >
            {loading ? <ClipLoader color={"#fff"} size={20} /> : "Continue"}
          </button>

          {/* OR Divider */}
          <div className="flex items-center justify-center space-x-4 mb-4 sm:mb-6 relative z-10">
            <div className="h-px bg-gray-500 w-full"></div>
            <p className="text-gray-300">OR</p>
            <div className="h-px bg-gray-500 w-full"></div>
          </div>

          {/* OAuth Buttons */}
          <button
            onClick={() => signIn("github", { callbackUrl: "/" })}
            className="w-full p-3 sm:p-4 bg-gray-900 text-white rounded-lg flex justify-center items-center space-x-4 mb-3 sm:mb-4 hover:bg-gray-800 transform transition-all hover:scale-105 hover:rotate-1"
          >
            <Image
              src="/github2.svg"
              alt="Github"
              width={150}
              height={150}
              priority
              className="w-6 h-6 sm:w-7 sm:h-7 animate-bounce"
            />
            <span className="font-semibold">Continue with Github</span>
          </button>

          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full p-3 sm:p-4 bg-white text-black rounded-lg flex justify-center items-center space-x-4 hover:bg-gray-100 transform transition-all hover:scale-105 hover:rotate-1"
          >
            <Image
              src="/google.svg"
              alt="Google"
              width={150}
              height={150}
              priority
              className="w-6 h-6 sm:w-7 sm:h-7 animate-bounce"
            />
            <span className="font-semibold">Continue with Google</span>
          </button>
          {/* Terms and Sign in */}
<p className="text-xs text-center text-gray-300 mt-2">
  By continuing, you agree to Pinterest’s{" "}
  <Link href="/" className="text-cyan-400 hover:underline">
    Terms of Services
  </Link>{" "}
  ,{" "}
  <Link href="/" className="text-cyan-400 hover:underline">
    Privacy Policy
  </Link>
</p>

<p className="text-center text-sm mt-2">
  Already have an account?{" "}
  <Link href="/signin" className="text-cyan-400 hover:underline">
    Sign In
  </Link>
</p>

        </div>
      </div>
    </>
  );
};

export default SignUp;
