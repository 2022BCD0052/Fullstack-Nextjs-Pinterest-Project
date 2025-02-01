// components/SearchParamsWrapper.js
"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

// This component ensures that search params are only used on the client side
const SearchParamsWrapper = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  const [searchParams, setSearchParams] = useState(null);

  useEffect(() => {
    setIsClient(true);
    setSearchParams(new URLSearchParams(window.location.search));
  }, []);

  if (!isClient) {
    return null; // Render nothing on the server side
  }

  // Pass down the searchParams to child components
  return <>{children(searchParams)}</>;
};

export default SearchParamsWrapper;
