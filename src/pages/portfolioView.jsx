import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta?.env?.VITE_API_URL || "http://localhost:3000";

function Portfolio() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOne = async () => {
      try {
        console.log("[PortfolioView] GET:", `${API_BASE}/portfolio/${id}`);
        const res = await axios.get(`${API_BASE}/portfolio/${id}`);
        console.log("[PortfolioView] OK:", res.status, res.data?.id || res.data?._id);
        setData(res.data);
      } catch (e) {
        const msg = e.response?.data || e.message;
        console.error("[PortfolioView] ERROR:", msg);
        setErr(typeof msg === "string" ? msg : JSON.stringify(msg));
      }
    };
    if (id) fetchOne();
  }, [id]);

  if (err) return <div style={{ color: "tomato", padding: 16 }}>Error: {err}</div>;
  if (!data) return <div>Loading...</div>;

  const coverSrc = data.coverImage || data.cover || "";
  const profileSrc = data.profileImage || data.main || "";

  return (
    <div className="container" style={{ maxWidth: 900, margin: "24px auto", color: "#fff" }}>
      <button
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-gray-500 text-white rounded-xl mb-4 hover:scale-105 transition-transform"
      >
        Back
      </button>

      {coverSrc && (
        <img
          src={coverSrc}
          alt="Cover"
          style={{ width: "100%", borderRadius: 12, marginBottom: 16 }}
        />
      )}

      {profileSrc && (
        <img
          src={profileSrc}
          alt="Profile"
          style={{ width: 140, height: 140, borderRadius: "50%", objectFit: "cover", marginBottom: 12 }}
        />
      )}

      <h1 style={{ margin: 0 }}>{data.name}</h1>
      <h2 style={{ marginTop: 6, color: "#bdbdbd", fontSize: 18 }}>{data.jobTitle}</h2>

      {data.description && <p style={{ marginTop: 10 }}>{data.description}</p>}

      <p style={{ marginTop: 10 }}>
        {data.email && <>Email: {data.email} &nbsp;&nbsp;</>}
        {data.phone && <>Phone: {data.phone}</>}
      </p>

      {Array.isArray(data.links) && data.links.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <h3 style={{ margin: "12px 0" }}>Links</h3>
          <ul>
            {data.links.map((l, i) => {
              const href = typeof l === "string" ? l : l?.url;
              const label = typeof l === "string" ? l : (l?.platform ? `${l.platform}: ${l.url}` : l?.url);
              return (
                href && (
                  <li key={i}>
                    <a href={href} target="_blank" rel="noreferrer">{label}</a>
                  </li>
                )
              );
            })}
          </ul>
        </div>
      )}

      {data.cv && (
        <div style={{ marginTop: 12 }}>
          <a href={data.cv} target="_blank" rel="noreferrer">
            Download CV
          </a>
        </div>
      )}

      {typeof data.views !== "undefined" && (
        <p style={{ marginTop: 12 }}>Views: {data.views}</p>
      )}
    </div>
  );
}

export default Portfolio;