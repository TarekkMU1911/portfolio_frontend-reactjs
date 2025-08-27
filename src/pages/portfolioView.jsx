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
        const res = await axios.get(`${API_BASE}/portfolio/${id}`);
        setData(res.data);
      } catch (e) {
        const msg = e.response?.data || e.message;
        setErr(typeof msg === "string" ? msg : JSON.stringify(msg));
      }
    };
    if (id) fetchOne();
  }, [id]);

  if (err) return <div style={{ color: "tomato", padding: 16 }}>Error: {err}</div>;
  if (!data) return <div>Loading...</div>;

  const coverSrc = data.coverPictureUrl || "";
  const profileSrc = data.mainPictureUrl || "";

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          style={styles.backBtn}
        >
          Back
        </button>

        {/* Cover & Profile */}
        {coverSrc && <img src={coverSrc} alt="Cover" style={styles.coverImage} />}
        {profileSrc && <img src={profileSrc} alt="Profile" style={styles.profileImage} />}

        {/* Name & Job */}
        <h1 style={styles.name}>{data.name}</h1>
        <h2 style={styles.jobTitle}>{data.jobTitle}</h2>

        {/* Description */}
        {data.description && <p style={styles.description}>{data.description}</p>}

        {/* Contact */}
        <p style={styles.contact}>
          {data.email && <>Email: {data.email} &nbsp;&nbsp;</>}
          {data.phoneNumber && <>Phone: {data.phoneNumber}</>}
        </p>

        {/* Links */}
        {Array.isArray(data.links) && data.links.length > 0 && (
          <div style={styles.linksContainer}>
            <h3 style={styles.linksTitle}>Links</h3>
            <ul>
              {data.links.map((l, i) => {
                const href = typeof l === "string" ? l : l?.url;
                const label = typeof l === "string" ? l : (l?.platform ? `${l.platform}: ${l.url}` : l?.url);
                return href && (
                  <li key={i}>
                    <a href={href} target="_blank" rel="noreferrer" style={styles.link}>{label}</a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* CV Download */}
        {data.cvUrl && (
          <a href={data.cvUrl} download style={styles.downloadBtn}>
            Download CV
          </a>
        )}

        {/* Update Portfolio Button */}
        <button
          onClick={() => navigate(`/portfolioEdition/${id}`)}
          style={styles.updateBtn}
        >
          Update Portfolio
        </button>

        {/* Views */}
        {typeof data.views !== "undefined" && (
          <p style={styles.views}>Views: {data.views}</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    background: "linear-gradient(135deg, #f7f9fc 0%, #80b895ff 50%, #e9eef5 100%)",
  },
  card: {
    width: "100%",
    maxWidth: "900px",
    backgroundColor: "#fff",
    borderRadius: "14px",
    padding: "32px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    border: "1px solid #eef0f3",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "16px",
  },
  backBtn: {
    alignSelf: "flex-start",
    width: 120,
    height: 40,
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#2f7b3a",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: "16px",
  },
  coverImage: {
    width: "100%",
    borderRadius: "12px",
    maxHeight: 300,
    objectFit: "cover",
    marginBottom: "16px",
  },
  profileImage: {
    width: 140,
    height: 140,
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "12px",
    border: "3px solid #2563eb",
  },
  name: {
    margin: 0,
    fontSize: "26px",
    fontWeight: 700,
    color: "#222",
  },
  jobTitle: {
    marginTop: 6,
    fontSize: "18px",
    color: "#6b7280",
  },
  description: {
    marginTop: 12,
    textAlign: "center",
    color: "#374151",
  },
  contact: {
    marginTop: 8,
    color: "#374151",
  },
  linksContainer: {
    marginTop: 12,
    width: "100%",
  },
  linksTitle: {
    margin: "12px 0",
    color: "#111827",
  },
  link: {
    color: "#2563eb",
    textDecoration: "none",
  },
  downloadBtn: {
    marginTop: 16,
    padding: "12px 24px",
    borderRadius: "12px",
    border: "1px solid #2f7b3a",
    backgroundColor: "#2f7b3a",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    textDecoration: "none",
  },
  updateBtn: {
    marginTop: 12,
    padding: "12px 24px",
    borderRadius: "12px",
    border: "1px solid #2563eb",
    backgroundColor: "#2563eb",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
  views: {
    marginTop: 12,
    color: "#6b7280",
    fontSize: "14px",
  },
};

export default Portfolio;
