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
    if (!portfolio && uid) initializePortfolio(uid);
  }, [portfolio, user, initializePortfolio]);

  if (!user || !portfolio) return <div className="pc-loading">Loading...</div>;

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
    <>
      <style>{`
        /* ====== Theme (scoped) ====== */
        .pc {
          --pc-primary: #2f7b3a;   /* Green */
          --pc-primary-600: #256e30;
          --pc-secondary: #2563eb; /* Blue */
          --pc-bg: #ffffff;
          --pc-border: #e5e7eb;
          --pc-muted: #6b7280;
          --pc-text: #111827;
          --pc-shadow: 0 10px 30px rgba(0,0,0,0.08);
          --pc-radius: 14px;
          --pc-input-radius: 10px;
        }

        /* ====== Container ====== */
        .pc-wrap {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px 20px;
          background: linear-gradient(135deg, #f7f9fc 0%, #80b895ff 50%, #e9eef5 100%);
        }

        .pc-card {
          width: 100%;
          max-width: 980px;
          background: var(--pc-bg);
          border: 1px solid #eef0f3;
          border-radius: var(--pc-radius);
          box-shadow: var(--pc-shadow);
          padding: 28px;
        }

        .pc-title {
          margin: 0 0 18px 0;
          text-align: center;
          font-size: 26px;
          font-weight: 700;
          color: #222;
        }

        /* ====== Grid Layout ====== */
        .pc-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 22px;
        }

        .pc-section {
          background: #fafafa;
          border: 1px solid var(--pc-border);
          border-radius: 12px;
          padding: 16px;
        }

        .pc-section h3 {
          margin: 0 0 10px 0;
          font-size: 16px;
          font-weight: 700;
          color: var(--pc-text);
        }

        .pc-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .pc-row .pc-field { margin: 0; }

        .pc-field {
          display: flex;
          flex-direction: column;
          margin-bottom: 12px;
        }

        .pc-label {
          font-size: 13px;
          color: var(--pc-muted);
          margin-bottom: 6px;
        }

        .pc-input, .pc-textarea {
          width: 100%;
          padding: 12px 14px;
          border-radius: var(--pc-input-radius);
          border: 1px solid #d9dee5;
          background: #fff;
          font-size: 15px;
          color: var(--pc-text);
          outline: none;
          transition: box-shadow .16s ease, border-color .16s ease;
        }
        .pc-input:focus, .pc-textarea:focus {
          border-color: var(--pc-secondary);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, .12);
        }
        .pc-textarea { min-height: 120px; resize: vertical; }

        /* Links list */
        .pc-links { display: flex; flex-direction: column; gap: 10px; }
        .pc-link-item {
          display: flex; justify-content: space-between; align-items: center;
          gap: 10px; padding: 10px 12px; border: 1px solid var(--pc-border);
          background: #fff; border-radius: 10px; font-size: 14px; color: var(--pc-text);
        }

        /* Buttons */
        .pc-actions { display: flex; justify-content: center; gap: 12px; margin-top: 16px; }
        .pc-btn {
          padding: 12px 18px; border-radius: 10px; border: none; cursor: pointer;
          font-weight: 700; font-size: 15px; transition: transform .12s ease, filter .16s ease;
        }
        .pc-btn:active { transform: scale(0.98); }

        .pc-btn-primary { background: var(--pc-primary); color: #fff; }
        .pc-btn-primary:hover { filter: brightness(0.96); }

        .pc-btn-secondary { background: #8e9196; color: #fff; }
        .pc-btn-secondary:hover { filter: brightness(0.96); }

        .pc-btn-small { background: var(--pc-secondary); color: #fff; padding: 10px 14px; font-size: 14px; }
        .pc-btn-danger { background: #ef4444; color: #fff; padding: 8px 12px; font-size: 13px; }

        /* Full-width blocks */
        .pc-span-2 { grid-column: 1 / -1; }

        /* Responsive */
        @media (max-width: 900px) {
          .pc-grid { grid-template-columns: 1fr; }
          .pc-row { grid-template-columns: 1fr; }
        }

        .pc-loading { text-align: center; margin-top: 40px; color: #444; font-size: 18px; }
      `}</style>

      <div className="pc pc-wrap">
        <div className="pc-card">
          <h1 className="pc-title">Create Portfolio</h1>

          <form onSubmit={handleSubmit} className="pc-grid">
            {/* ===== Left: Basic Info ===== */}
            <div className="pc-section">
              <h3>Basic Info</h3>

              <div className="pc-row">
                <div className="pc-field">
                  <label htmlFor="firstName" className="pc-label">First Name</label>
                  <input id="firstName" name="firstName" className="pc-input"
                    value={portfolio.firstName || ""} onChange={handleChange} />
                </div>
                <div className="pc-field">
                  <label htmlFor="lastName" className="pc-label">Last Name</label>
                  <input id="lastName" name="lastName" className="pc-input"
                    value={portfolio.lastName || ""} onChange={handleChange} />
                </div>
              </div>

              <div className="pc-field">
                <label htmlFor="name" className="pc-label">Full name (optional)</label>
                <input id="name" name="name" className="pc-input"
                  value={portfolio.name || ""} onChange={handleChange} />
              </div>

              <div className="pc-field">
                <label htmlFor="email" className="pc-label">Email</label>
                <input id="email" name="email" className="pc-input"
                  value={portfolio.email || ""} onChange={handleChange} />
              </div>

              <div className="pc-row">
                <div className="pc-field">
                  <label htmlFor="jobTitle" className="pc-label">Job Title</label>
                  <input id="jobTitle" name="jobTitle" className="pc-input"
                    value={portfolio.jobTitle || ""} onChange={handleChange} />
                </div>
                <div className="pc-field">
                  <label htmlFor="phone" className="pc-label">Phone</label>
                  <input id="phone" name="phone" className="pc-input"
                    value={portfolio.phone || ""} onChange={handleChange} />
                </div>
              </div>
            </div>

            {/* ===== Right: Media & Links ===== */}
            <div className="pc-section">
              <h3>Media & Links</h3>

              <div className="pc-field">
                <label htmlFor="profileImage" className="pc-label">Main Picture</label>
                <input id="profileImage" type="file" name="profileImage" accept="image/*"
                  className="pc-input" onChange={handleFileChange} />
              </div>

              <div className="pc-field">
                <label htmlFor="coverImage" className="pc-label">Cover Picture</label>
                <input id="coverImage" type="file" name="coverImage" accept="image/*"
                  className="pc-input" onChange={handleFileChange} />
              </div>

              <div className="pc-field">
                <label htmlFor="cv" className="pc-label">CV (pdf/doc)</label>
                <input id="cv" type="file" name="cv" accept=".pdf,.doc,.docx"
                  className="pc-input" onChange={handleFileChange} />
              </div>

              <div className="pc-row">
                <div className="pc-field">
                  <label htmlFor="platform" className="pc-label">Platform</label>
                  <input id="platform" name="platform" placeholder="LinkedIn / GitHub ..."
                    value={linkInput.platform} onChange={handleLinkChange} className="pc-input" />
                </div>
                <div className="pc-field">
                  <label htmlFor="url" className="pc-label">URL</label>
                  <input id="url" name="url" placeholder="https://..."
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

            {/* ===== Description (full width) ===== */}
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
              <button type="submit" className="pc-btn pc-btn-primary">Create Portfolio</button>
              <button type="button" onClick={() => navigate("/home")} className="pc-btn pc-btn-secondary">Back</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default PortfolioCreation;