import React, { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { usePortfolio } from "../context/createPContext";
import { useNavigate } from "react-router-dom";

function PortfolioCreation() {
  const { user } = useAuth();
  const { portfolio, setPortfolio, createPortfolio, initializePortfolio } = usePortfolio();
  const [linkInput, setLinkInput] = useState({ platform: "", url: "" });
  const [files, setFiles] = useState({ mainPicture: null, coverPicture: null, cv: null });
  const navigate = useNavigate();

  // Initialize empty portfolio when component mounts
  useEffect(() => {
    if (!portfolio && user) initializePortfolio(user.id);
  }, [portfolio, initializePortfolio, user]);

  if (!user || !portfolio) return <div>Loading...</div>;

  const handleChange = (e) =>
    setPortfolio({ ...portfolio, [e.target.name]: e.target.value });

  const handleLinkChange = (e) =>
    setLinkInput({ ...linkInput, [e.target.name]: e.target.value });

  const addLink = () => {
    if (linkInput.platform && linkInput.url) {
      setPortfolio({ ...portfolio, links: [...portfolio.links, linkInput] });
      setLinkInput({ platform: "", url: "" });
    }
  };

  const removeLink = (index) => {
    const newLinks = portfolio.links.filter((_, i) => i !== index);
    setPortfolio({ ...portfolio, links: newLinks });
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles({ ...files, [name]: selectedFiles[0] });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("name", portfolio.name);
  formData.append("jobTitle", portfolio.jobTitle);
  formData.append("description", portfolio.description);
  formData.append("email", portfolio.email);
  formData.append("phone", portfolio.phone);

  // links must be a JSON string (not array directly)
  formData.append("links", JSON.stringify(portfolio.links));

  if (portfolio.profileImage) {
    formData.append("profileImage", portfolio.profileImage);
  }
  if (portfolio.coverImage) {
    formData.append("coverImage", portfolio.coverImage);
  }
  if (portfolio.cv) {
    formData.append("cv", portfolio.cv);
  }

  try {
    await createPortfolio(user.id, formData); // ✅ matches Postman
    alert("Portfolio created successfully!");
  } catch (error) {
    console.error("Error creating portfolio:", error.response?.data || error.message);
    alert("Error creating portfolio");
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

        <label>Email</label>
        <input name="email" value={portfolio.email} onChange={handleChange} style={styles.input} />

        <label>Job Title</label>
        <input name="jobTitle" value={portfolio.jobTitle} onChange={handleChange} style={styles.input} />

        <label>Description</label>
        <textarea name="description" value={portfolio.description} onChange={handleChange} style={styles.textarea} />

        <label>Phone Number</label>
        <input name="phoneNumber" value={portfolio.phoneNumber} onChange={handleChange} style={styles.input} />

        <label>Main Picture</label>
        <input type="file" name="mainPicture" accept="image/*" onChange={handleFileChange} style={styles.input} />

        <label>Cover Picture</label>
        <input type="file" name="coverPicture" accept="image/*" onChange={handleFileChange} style={styles.input} />

        <label>CV</label>
        <input type="file" name="cv" accept=".pdf,.doc,.docx" onChange={handleFileChange} style={styles.input} />

        <h3>Links</h3>
        <div style={styles.linksContainer}>
          <input name="platform" placeholder="Platform" value={linkInput.platform} onChange={handleLinkChange} style={styles.input} />
          <input name="url" placeholder="URL" value={linkInput.url} onChange={handleLinkChange} style={styles.input} />
          <button type="button" onClick={addLink} style={styles.button}>Add Link</button>
        </div>

        <div style={styles.linksList}>
          {portfolio.links.map((link, i) => (
            <div key={i} style={styles.linkItem}>
              <span>{link.platform}: {link.url}</span>
              <button type="button" onClick={() => removeLink(i)} style={styles.removeBtn}>X</button>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button type="submit" style={styles.button}>Create Portfolio</button>
          <button type="button" onClick={() => navigate("/home")} style={styles.backBtn}>Back</button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: "700px", margin: "20px auto", padding: "20px", backgroundColor: "#1e1e1e", borderRadius: "10px", color: "#fff" },
  title: { textAlign: "center", marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: { padding: "10px", borderRadius: "5px", border: "none", fontSize: "16px", background: "#fff" },
  textarea: { padding: "10px", borderRadius: "5px", border: "none", fontSize: "16px", resize: "vertical", background: "#fff" },
  button: { padding: "10px", borderRadius: "5px", border: "none", backgroundColor: "#4caf50", color: "#fff", cursor: "pointer", fontWeight: "bold", fontSize: "16px" },
  backBtn: { padding: "10px", borderRadius: "5px", border: "none", backgroundColor: "#888", color: "#fff", cursor: "pointer", fontWeight: "bold", fontSize: "16px" },
  linksContainer: { display: "flex", gap: "10px", flexWrap: "wrap" },
  linksList: { marginTop: "10px" },
  linkItem: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" },
  removeBtn: { marginLeft: "10px", backgroundColor: "#f44336", color: "#fff", border: "none", borderRadius: "3px", cursor: "pointer" },
};

export default PortfolioCreation;
