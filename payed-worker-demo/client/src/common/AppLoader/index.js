// AppLoader.js
// Component to show a loading message and provide start/stop loader functions

import React, { useState } from "react";
import Loader from "./Loader";

const AppLoader = () => {
  
  const [loading, setLoading] = useState(false); // State to track loading

  // Function to show loader
  const startLoading = () => setLoading(true);

  // Function to hide loader
  const stopLoading = () => setLoading(false);

  // Return as array (React 17 supports this) — first is UI, second & third are control functions
  return [
    loading ? <div key="loader">Loading.....</div> : null, // UI
    startLoading, // Function to start loader
    stopLoading   // Function to stop loader
  ];
 
};
export default AppLoader;
