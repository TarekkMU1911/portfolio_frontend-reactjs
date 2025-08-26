import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { usePortfolio } from "../context/createPContext";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function PortfolioCreation() {
  const { user } = useAuth();
  const { portfolio, setPortfolio, createPortfolio, initializePortfolio } = usePortfolio();
  const [linkInput, setLinkInput] = useState({ platform: "", url: "" });
  const [files, setFiles] = useState({ profileImage: null, coverImage: null, cv: null });
  const navigate = useNavigate();

  useEffect(() => {
    const uid = user?.id ?? user?._id ?? user?.userId;
    if (!portfolio && uid) {
      initializePortfolio(uid);
    }
  }, [portfolio, user, initializePortfolio]);

  if (!user || !portfolio) return <div>Loading...</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPortfolio((prev) => ({ ...prev, [name]: value }));
  };

  const handleLinkChange = (e) =>
    setLinkInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const addLink = () => {
    if (!linkInput.platform || !linkInput.url) return;
    setPortfolio((prev) => ({ ...prev, links: [...(prev.links || []), linkInput] }));
    setLinkInput({ platform: "", url: "" });
  };

  const removeLink = (index) => {
    setPortfolio((prev) => ({ ...prev, links: prev.links.filter((_, i) => i !== index) }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles((prev) => ({ ...prev, [name]: selectedFiles[0] || null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const finalName = portfolio.name?.trim()
      ? portfolio.name.trim()
      : `${(portfolio.firstName || "").trim()} ${(portfolio.lastName || "").trim()}`.trim();

    const urls = (portfolio.links || [])
      .map((l) => (typeof l === "string" ? l : l?.url))
      .filter(Boolean);

    const uid = user?.id ?? user?._id ?? user?.userId;

    try {
      try {
        const byUser = await API.get(`/portfolio/user/${uid}`);
        if (byUser.data?.id || byUser.data?._id) {
          const pid = byUser.data.id || byUser.data._id;
          navigate(`/portfolio/${pid}`);
          return;
        }
      } catch {}

      try {
        const search = await API.get(`/portfolio?userId=${uid}&limit=1`);
        const existing = search.data?.items?.[0];
        if (existing?.id || existing?._id) {
          const pid = existing.id || existing._id;
          navigate(`/portfolio/${pid}`);
          return;
        }
      } catch {}

      const saved = await createPortfolio({
        userId: uid,
        name: finalName || "",
        jobTitle: portfolio.jobTitle || "",
        description: portfolio.description || "",
        email: portfolio.email || "",
        phone: portfolio.phone || "",
        links: urls,
        profileImage: files.profileImage,
        coverImage: files.coverImage,
        cv: files.cv,
      });

      const savedId = saved?.id || saved?._id;
      navigate(`/portfolio/${savedId}`);
    } catch (err) {
      const serverMsg = err.response?.data?.message || JSON.stringify(err.response?.data) || err.message;
      alert(`Error creating portfolio: ${serverMsg}`);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Create Portfolio</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label>First Name</label>
        <input name="firstName" value={portfolio.firstName || ""} onChange={handleChange} style={styles.input} />
        <label>Last Name</label>
        <input name="lastName" value={portfolio.lastName || ""} onChange={handleChange} style={styles.input} />
        <label>Full name (optional)</label>
        <input name="name" value={portfolio.name || ""} onChange={handleChange} style={styles.input} />
        <label>Email</label>
        <input name="email" value={portfolio.email || ""} onChange={handleChange} style={styles.input} />
        <label>Job Title</label>
        <input name="jobTitle" value={portfolio.jobTitle || ""} onChange={handleChange} style={styles.input} />
        <label>Description</label>
        <textarea name="description" value={portfolio.description || ""} onChange={handleChange} style={styles.textarea} />
        <label>Phone</label>
        <input name="phone" value={portfolio.phone || ""} onChange={handleChange} style={styles.input} />
        <label>Main Picture</label>
        <input type="file" name="profileImage" accept="image/*" onChange={handleFileChange} style={styles.input} />
        <label>Cover Picture</label>
        <input type="file" name="coverImage" accept="image/*" onChange={handleFileChange} style={styles.input} />
        <label>CV (pdf/doc)</label>
        <input type="file" name="cv" accept=".pdf,.doc,.docx" onChange={handleFileChange} style={styles.input} />
        <h3>Links</h3>
        <div style={styles.linksContainer}>
          <input name="platform" placeholder="Platform" value={linkInput.platform} onChange={handleLinkChange} style={styles.input} />
          <input name="url" placeholder="https://..." value={linkInput.url} onChange={handleLinkChange} style={styles.input} />
          <button type="button" onClick={addLink} style={styles.smallButton}>Add</button>
        </div>
        <div style={styles.linksList}>
          {(portfolio.links || []).map((link, i) => (
            <div key={i} style={styles.linkItem}>
              <span>{link.platform}: {link.url}</span>
              <button type="button" onClick={() => removeLink(i)} style={styles.removeBtn}>X</button>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: "10px", marginTop: 12 }}>
          <button type="submit" style={styles.button}>Create Portfolio</button>
          <button type="button" onClick={() => navigate("/home")} style={styles.backBtn}>Back</button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: 760, margin: "24px auto", padding: 20, backgroundColor: "#1e1e1e", borderRadius: 10, color: "#fff" },
  title: { textAlign: "center", marginBottom: 12 },
  form: { display: "flex", flexDirection: "column", gap: 10 },
  input: { padding: 10, borderRadius: 6, border: "none", fontSize: 15, background: "#fff" },
  textarea: { padding: 10, borderRadius: 6, border: "none", fontSize: 15, minHeight: 100, background: "#fff" },
  button: { padding: "10px 14px", borderRadius: 6, border: "none", backgroundColor: "#4caf50", color: "#fff", cursor: "pointer", fontWeight: "600" },
  smallButton: { padding: "8px 10px", borderRadius: 6, border: "none", backgroundColor: "#2196f3", color: "#fff", cursor: "pointer" },
  backBtn: { padding: "10px 14px", borderRadius: 6, border: "none", backgroundColor: "#888", color: "#fff", cursor: "pointer" },
  linksContainer: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" },
  linksList: { marginTop: 8 },
  linkItem: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 6, background: "#fff", padding: 8, borderRadius: 6, color: "#000" },
  removeBtn: { marginLeft: 8, backgroundColor: "#f44336", color: "#fff", border: "none", borderRadius: 4, padding: "6px 8px", cursor: "pointer" },
};

export default PortfolioCreation;