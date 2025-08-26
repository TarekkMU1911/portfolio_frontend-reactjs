// portfolioCreation.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { usePortfolio } from "../context/createPContext";
import { useNavigate } from "react-router-dom";

function PortfolioCreation() {
  const { user } = useAuth();
  const { portfolio, setPortfolio, createPortfolio, initializePortfolio } = usePortfolio();
  const [linkInput, setLinkInput] = useState({ platform: "", url: "" });
  const [files, setFiles] = useState({ profileImage: null, coverImage: null, cv: null });
  const navigate = useNavigate();

  // initialize blank portfolio when component mounts
  useEffect(() => {
    if (!portfolio && user) initializePortfolio(user.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [portfolio, user]);

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

  // files: names must match backend interceptor: profileImage, coverImage, cv
  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles((prev) => ({ ...prev, [name]: selectedFiles[0] || null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Build formData that matches backend DTO + file field names
    const formData = new FormData();

    // Name: either explicit `name` or combine first + last
    const finalName = portfolio.name?.trim()
      ? portfolio.name.trim()
      : `${(portfolio.firstName || "").trim()} ${(portfolio.lastName || "").trim()}`.trim();

    formData.append("name", finalName || "");
    formData.append("jobTitle", portfolio.jobTitle || "");
    formData.append("description", portfolio.description || "");
    formData.append("email", portfolio.email || "");
    formData.append("phone", portfolio.phone || "");

    // links: backend expects JSON string of URLs; DTO uses @IsUrl each: true
    // Convert portfolio.links (array of {platform,url}) to array of url strings
    const urls = (portfolio.links || []).map((l) => l.url).filter(Boolean);
    formData.append("links", JSON.stringify(urls));

    // Files: names per backend interceptor
    if (files.profileImage) formData.append("profileImage", files.profileImage);
    if (files.coverImage) formData.append("coverImage", files.coverImage);
    if (files.cv) formData.append("cv", files.cv);

    try {
      const saved = await createPortfolio(user.id, formData);
      // success -> navigate to portfolio view
      navigate(`/portfolio/${saved.id}`);
    } catch (err) {
      // show detailed message in console and user-friendly alert
      console.error("Create failed:", err.response?.data || err.message);
      const serverMsg = err.response?.data?.message || JSON.stringify(err.response?.data) || err.message;
      alert(`Error creating portfolio: ${serverMsg}`);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Create Portfolio</h1>
      <form onSubmit={handleSubmit} style={styles.form}>
        <label>First Name</label>
        <input name="firstName" value={portfolio.firstName} onChange={handleChange} style={styles.input} />

        <label>Last Name</label>
        <input name="lastName" value={portfolio.lastName} onChange={handleChange} style={styles.input} />

        <label>Full name (optional)</label>
        <input name="name" value={portfolio.name} onChange={handleChange} placeholder="Optional: overrides first+last" style={styles.input} />

        <label>Email</label>
        <input name="email" value={portfolio.email} onChange={handleChange} style={styles.input} />

        <label>Job Title</label>
        <input name="jobTitle" value={portfolio.jobTitle} onChange={handleChange} style={styles.input} />

        <label>Description</label>
        <textarea name="description" value={portfolio.description} onChange={handleChange} style={styles.textarea} />

        <label>Phone</label>
        <input name="phone" value={portfolio.phone} onChange={handleChange} style={styles.input} />

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
          {portfolio.links.map((link, i) => (
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
