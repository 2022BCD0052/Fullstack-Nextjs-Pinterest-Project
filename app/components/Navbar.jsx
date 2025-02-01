"use client";
import { Menu, Search, LogOut, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown state
  const dropdownRef = useRef(null); // Ref for dropdown

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/?search=${query}`);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false); // Close dropdown if clicking outside
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    signOut({ callbackUrl: "/signin" });
    setIsSidebarOpen(false); // Close the sidebar after logout
  };

  return (
    <nav className="w-full z-50 shadow-md bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 px-6 md:px-10 py-4 relative">
      <div className="flex justify-between items-center container mx-auto">
        {/* Left - Logo & Desktop Links */}
        <div className="flex items-center space-x-6">
          <Link href="/">
            <Image src="/pinterest.svg" width={40} height={40} alt="LOGO" className="w-10 h-10 cursor-pointer" priority />
          </Link>
          <Link href="/" className="hidden md:block text-lg font-medium text-gray-700 hover:text-red-500 transition">
            Home
          </Link>
          <Link href="/upload-pin" className="hidden md:block text-lg font-medium text-gray-700 hover:text-red-500 transition">
            Create Pin
          </Link>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex items-center  w-1/2">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              className="w-full py-2.5 px-5 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 pr-12 shadow-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Search
              onClick={handleSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-red-500 text-white w-10 h-10 p-2 rounded-full transition hover:bg-red-700 cursor-pointer"
            />
          </div>
        </div>

        {/* Profile & Menu Icon */}
        <div className="flex items-center space-x-4">
          {session?.user?.image && (
            <div ref={dropdownRef} className="relative">
              <Image
                src={session.user.image}
                alt="Profile"
                width={40}
                height={40}
                className="w-10 h-10 rounded-full border border-gray-300 cursor-pointer hover:ring-2 hover:ring-red-400 transition hidden md:block"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              />
              {/* Dropdown Menu for Desktop */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-10">
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-red-500 w-full text-start hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <button className="md:hidden text-red-500 " onClick={() => setIsSidebarOpen(true)}>
            <Menu size={36} />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar (Opens from Right) */}
      <div
        className={`fixed top-0 right-0 h-screen w-64 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg transform transition-transform duration-300 z-50 ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-300">Menu</h2>
          <button onClick={() => setIsSidebarOpen(false)}>
            <X size={28} className="text-gray-600 hover:text-red-500 transition" />
          </button>
        </div>

        <nav className="p-4 space-y-4">
          <Link href="/" className="block py-2 text-lg font-medium text-gray-300 hover:text-red-500 transition" onClick={() => setIsSidebarOpen(false)}>
            Home
          </Link>
          <Link href="/upload-pin" className="block py-2 text-lg font-medium text-gray-300 hover:text-red-500 transition" onClick={() => setIsSidebarOpen(false)}>
            Create Pin
          </Link>

          {/* Search Bar (Mobile) */}
          <div className="relative py-2">
            <input
              type="text"
              placeholder="Search..."
              className="w-full py-2 px-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 pr-12"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Search
              onClick={handleSearch}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-red-500 text-white w-10 h-10 p-2 rounded-full hover:bg-red-700 cursor-pointer"
            />
          </div>

          {/* Logout Button inside Sidebar (Mobile) */}
          {session?.user && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 text-red-600 font-medium bg-gray-100 rounded-lg hover:bg-red-100 transition"
            >
              <LogOut size={20} /> Logout
            </button>
          )}
        </nav>
      </div>

      {/* Overlay when sidebar is open */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={() => setIsSidebarOpen(false)}></div>}
    </nav>
  );
};

export default Navbar;
