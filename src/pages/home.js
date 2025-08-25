import React from "react";
import API from "../services/api";

function Home() {
  const handleClick = async () => {
    try {
      const res = await API.get("/portfolio");
      console.log("Response:", res.data);
      alert("Check Inspect → Network tab");
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-white">
      <button
        onClick={handleClick}
        className="px-6 py-3 text-white bg-blue-500 rounded-xl transition-transform transform hover:scale-110"
      >
        Fetch Portfolio
      </button>
    </div>
  );
}

export default Home;
