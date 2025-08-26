import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function PortfolioEdition() {
  const [portfolio, setPortfolio] = useState({
    fullName: "",
    jobTitle: "",
    description: "",
    email: "",
    phone: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await API.get("/portfolio/my");
        setPortfolio(res.data);
      } catch (err) {
        console.error("Error fetching portfolio:", err);
      }
    };
    fetchPortfolio();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPortfolio((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await API.put(`/portfolio/${portfolio.id}`, portfolio);
      navigate("/portfolioView");
    } catch (err) {
      console.error("Error updating portfolio:", err);
      alert("Failed to update portfolio");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Edit Portfolio</h1>

      <div className="w-full max-w-md space-y-4">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={portfolio.fullName}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
        />
        <input
          type="text"
          name="jobTitle"
          placeholder="Job Title"
          value={portfolio.jobTitle}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={portfolio.description}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={portfolio.email}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={portfolio.phone}
          onChange={handleChange}
          className="w-full p-3 border rounded-xl"
        />
      </div>

      <div className="flex gap-4 mt-6">
        <button
          onClick={handleSave}
          className="px-6 py-3 text-white bg-blue-500 rounded-xl transition-transform transform hover:scale-110"
        >
          Save
        </button>
        <button
          onClick={handleBack}
          className="px-6 py-3 text-white bg-gray-500 rounded-xl transition-transform transform hover:scale-110"
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default PortfolioEdition;
