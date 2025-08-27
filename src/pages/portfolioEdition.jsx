import React, { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";

function PortfolioEdition() {
  const { user } = useAuth();
  const { id } = useParams(); // portfolio id
  const [portfolio, setPortfolio] = useState(null);
  const [linkInput, setLinkInput] = useState({ platform: "", url: "" });
  const [files, setFiles] = useState({ profileImage: null, coverImage: null, cv: null });
  const navigate = useNavigate();

  // fetch existing portfolio
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await API.get(`/portfolio/${id}`);
        setPortfolio(res.data);
      } catch (err) {
        console.error("Error fetching portfolio:", err);
      }
    };
    if (id) fetchPortfolio();
  }, [id]);

  if (!user || !portfolio) return <div className="pc-loading">Loading...</div>;

  // form change handlers
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

    try {
      const formData = new FormData();
      formData.append("name", finalName || "");
      formData.append("firstName", portfolio.firstName || "");
      formData.append("lastName", portfolio.lastName || "");
      formData.append("jobTitle", portfolio.jobTitle || "");
      formData.append("description", portfolio.description || "");
      formData.append("email", portfolio.email || "");
      formData.append("phone", portfolio.phone || "");
      formData.append("links", JSON.stringify(urls));

      if (files.profileImage) formData.append("profileImage", files.profileImage);
      if (files.coverImage) formData.append("coverImage", files.coverImage);
      if (files.cv) formData.append("cv", files.cv);

      await API.patch(`/portfolio/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ✅ go to View Portfolio after update
      navigate(`/portfolio/${id}`);
    } catch (err) {
      const serverMsg = err.response?.data?.message || JSON.stringify(err.response?.data) || err.message;
      alert(`Error updating portfolio: ${serverMsg}`);
    }
  };

  return (
    <>
      <style>{`
        /* Copy-paste the exact CSS from PortfolioCreation.jsx */
      `}</style>

      <div className="pc pc-wrap">
        <div className="pc-card">
          <h1 className="pc-title">Edit Portfolio</h1>

          <form onSubmit={handleSubmit} className="pc-grid">
            {/* ===== Left: Basic Info ===== */}
            <div className="pc-section">
              <h3>Basic Info</h3>

              <div className="pc-row">
                <div className="pc-field">
                  <label className="pc-label">First Name</label>
                  <input name="firstName" className="pc-input"
                    value={portfolio.firstName || ""} onChange={handleChange} />
                </div>
                <div className="pc-field">
                  <label className="pc-label">Last Name</label>
                  <input name="lastName" className="pc-input"
                    value={portfolio.lastName || ""} onChange={handleChange} />
                </div>
              </div>

              <div className="pc-field">
                <label className="pc-label">Full name (optional)</label>
                <input name="name" className="pc-input"
                  value={portfolio.name || ""} onChange={handleChange} />
              </div>

              <div className="pc-field">
                <label className="pc-label">Email</label>
                <input name="email" className="pc-input"
                  value={portfolio.email || ""} onChange={handleChange} />
              </div>

              <div className="pc-row">
                <div className="pc-field">
                  <label className="pc-label">Job Title</label>
                  <input name="jobTitle" className="pc-input"
                    value={portfolio.jobTitle || ""} onChange={handleChange} />
                </div>
                <div className="pc-field">
                  <label className="pc-label">Phone</label>
                  <input name="phone" className="pc-input"
                    value={portfolio.phone || ""} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* ===== Right: Media & Links ===== */}
            <div className="pc-section">
              <h3>Media & Links</h3>

              <div className="pc-field">
                <label className="pc-label">Main Picture</label>
                <input type="file" name="profileImage" accept="image/*"
                  className="pc-input" onChange={handleFileChange} />
              </div>

              <div className="pc-field">
                <label className="pc-label">Cover Picture</label>
                <input type="file" name="coverImage" accept="image/*"
                  className="pc-input" onChange={handleFileChange} />
              </div>

              <div className="pc-field">
                <label className="pc-label">CV (pdf/doc)</label>
                <input type="file" name="cv" accept=".pdf,.doc,.docx"
                  className="pc-input" onChange={handleFileChange} />
              </div>

              <div className="pc-row">
                <div className="pc-field">
                  <label className="pc-label">Platform</label>
                  <input name="platform" placeholder="LinkedIn / GitHub ..."
                    value={linkInput.platform} onChange={handleLinkChange} className="pc-input" />
                </div>
                <div className="pc-field">
                  <label className="pc-label">URL</label>
                  <input name="url" placeholder="https://..."
                    value={linkInput.url} onChange={handleLinkChange} className="pc-input" />
                </div>
              </div>

              <button type="button" onClick={addLink} className="pc-btn pc-btn-small">Add link</button>

              <div className="pc-links" style={{ marginTop: 10 }}>
                {(portfolio.links || []).map((link, i) => (
                  <div key={i} className="pc-link-item">
                    <span>{link.platform}: {link.url}</span>
                    <button type="button" onClick={() => removeLink(i)} className="pc-btn pc-btn-danger">Remove</button>
                  </div>
                ))}
              </div>
            </div>

            {/* ===== Description ===== */}
            <div className="pc-section pc-span-2">
              <h3>Description</h3>
              <textarea
                name="description"
                value={portfolio.description || ""}
                onChange={handleChange}
                className="pc-textarea"
                placeholder="Tell us about your experience, skills, and highlights..."
              />
            </div>

            {/* ===== Actions ===== */}
            <div className="pc-actions pc-span-2">
              <button type="submit" className="pc-btn pc-btn-primary">Update Portfolio</button>
              <button type="button" onClick={() => navigate(`/portfolio/${id}`)} className="pc-btn pc-btn-secondary">Back</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default PortfolioEdition;
