"use client";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "react-toastify";

const SignIn = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  const handleCredentialsLogin = async () => {
    setLoading(true);
    if (!username || !password) {
      toast.error("Please provide your credentials.");
      setLoading(false);
      return;
    }
    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });
    setLoading(false);
    if (res.error) {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-black via-gray-800 to-gray-900 fixed  top-0 left-0 w-full px-4 sm:px-6">
      <div className="relative p-6 sm:p-10 rounded-3xl shadow-xl w-full max-w-sm sm:max-w-md transform transition duration-700 hover:scale-105 hover:shadow-2xl bg-black bg-opacity-40 backdrop-blur-md border border-gray-600 border-opacity-50">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-pink-500 to-cyan-400 opacity-20 blur-2xl pointer-events-none"></div>

        <div className="flex justify-center mb-6 relative z-10">
          <Image
            src="/pinterest.svg"
            alt="Pinterest Svg"
            height={100}
            width={100}
            priority
            className="w-14 h-14 sm:w-16 sm:h-16 animate-pulse"
          />
        </div>

        <h2 className="text-center text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400 mb-4">
          Log in to see more
        </h2>
        <p className="text-center text-gray-300 mb-6 text-sm sm:text-base">
          Unlock Pinterest\u2019s best ideas with your free account
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
          type="password"
          placeholder="Password"
          className="w-full p-3 sm:p-4 border-2 border-transparent bg-transparent text-white rounded-lg mb-3 sm:mb-4 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50 transform hover:scale-105 transition duration-300"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* SignIn Button */}
        <button
          onClick={handleCredentialsLogin}
          className="w-full p-3 sm:p-4 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold rounded-lg mb-4 sm:mb-6 transform transition-all hover:scale-110 hover:shadow-2xl"
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
          className="w-full p-3 sm:p-4 bg-gray-900 text-white rounded-lg flex justify-center items-center space-x-4 mb-3 sm:mb-4 hover:bg-gray-800 transform transition-all hover:scale-105"
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
          className="w-full p-3 sm:p-4 bg-white text-black rounded-lg flex justify-center items-center space-x-4 hover:bg-gray-100 transform transition-all hover:scale-105"
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

        {/* Terms and Sign Up */}
        <p className="text-xs text-center text-gray-300 mt-2">
          By continuing, you agree to Pinterest\u2019s{" "}
          <Link href="/" className="text-cyan-400 hover:underline">
            Terms of Services
          </Link>{" "}
          ,{" "}
          <Link href="/" className="text-cyan-400 hover:underline">
            Privacy Policy
          </Link>
        </p>

        <p className="text-center text-sm mt-2">
          Not a Member?{" "}
          <Link href="/signup" className="text-cyan-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
