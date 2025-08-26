import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import axios from "axios";

function Portfolio() {
  const { username } = useParams();
  const { user } = useAuth(); // ✅ call hook here at top level
  const [portfolio, setPortfolio] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return; // wait until user is loaded
      try {
        const res = await axios.get(`http://localhost:3000/user/${user.id}/portfolio`);
        setPortfolio(res.data);
      } catch (err) {
        console.error("Error fetching portfolio:", err);
      }
    };
    fetchData();
  }, [user]);

  if (!portfolio) return <div>Loading...</div>;

  return (
    <div className="container">
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-gray-500 text-white rounded-xl mb-4 hover:scale-105 transition-transform"
      >
        Back
      </button>

      <img src={portfolio.cover} alt="Cover" style={{ width: "100%" }} />
      <img
        src={portfolio.main}
        alt="Profile"
        style={{ width: "150px", borderRadius: "50%" }}
      />
      <h1>{portfolio.name}</h1>
      <h2>{portfolio.jobTitle}</h2>
      <p>{portfolio.description}</p>
      <p>Email: {portfolio.email}</p>
      <p>Phone: {portfolio.phone}</p>
      {portfolio.links?.map((link, i) => (
        <div key={i}>
          <a href={link} target="_blank" rel="noreferrer">{link}</a>
        </div>
      ))}
      {portfolio.cv && (
        <div>
          <a href={portfolio.cv} target="_blank" rel="noreferrer">
            Download CV
          </a>
        </div>
      )}
      <p>Views: {portfolio.views}</p>
    </div>
  );
}

export default Portfolio;
