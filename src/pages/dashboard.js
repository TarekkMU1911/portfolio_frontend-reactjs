import React, { useState } from "react";
import { useAuth } from "../context/authContext";
import { usePortfolio } from "../context/dashboardContext";
import { useNavigate } from "react-router-dom"; 

function Dashboard() {
  const { user, logout } = useAuth();
  const { portfolio, setPortfolio, updatePortfolio } = usePortfolio();
  const [linkInput, setLinkInput] = useState({ platform: "", url: "" });
  const navigate = useNavigate(); 

  if (!user || !portfolio) return <div>Loading user...</div>;

  const handleChange = e =>
    setPortfolio({ ...portfolio, [e.target.name]: e.target.value });

  const handleLinkChange = e =>
    setLinkInput({ ...linkInput, [e.target.name]: e.target.value });

  const addLink = () => {
    if (linkInput.platform && linkInput.url) {
      setPortfolio({ ...portfolio, links: [...portfolio.links, linkInput] });
      setLinkInput({ platform: "", url: "" });
    }
  };

  const removeLink = index => {
    const newLinks = [...portfolio.links];
    newLinks.splice(index, 1);
    setPortfolio({ ...portfolio, links: newLinks });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const savedPortfolio = await updatePortfolio({
        ...portfolio,
        mainPicture: portfolio.main,
        coverPicture: portfolio.cover,
      }); 
      alert("Portfolio saved");
      navigate(`/portfolio/${user.id}/${savedPortfolio.id}`);
    } catch (err) {
      console.error(err);
      alert("Error saving portfolio");
    }
  };




  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Welcome {user.username}</h1>
      <button onClick={logout} style={styles.logoutBtn}>Logout</button>

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
        <input name="main" placeholder="Filename or URL" value={portfolio.main} onChange={handleChange} style={styles.input} />

        <label>Cover Picture</label>
        <input name="cover" placeholder="Filename or URL" value={portfolio.cover} onChange={handleChange} style={styles.input} />

        <label>CV</label>
        <input name="cv" placeholder="Filename or URL" value={portfolio.cv} onChange={handleChange} style={styles.input} />

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

        <button type="submit" style={styles.button}>Save Portfolio</button>
      </form>
    </div>
  );
}

const styles = {
  container: { maxWidth: "700px", margin: "20px auto", padding: "20px", backgroundColor: "#1e1e1e", borderRadius: "10px", color: "#fff", fontFamily: "Arial,sans-serif" },
  title: { textAlign: "center", marginBottom: "20px" },
  logoutBtn: { backgroundColor: "#ff9800", color: "#fff", border: "none", padding: "10px 20px", borderRadius: "5px", cursor: "pointer", marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "10px" },
  input: { padding: "10px", borderRadius: "5px", border: "none", fontSize: "16px" },
  textarea: { padding: "10px", borderRadius: "5px", border: "none", fontSize: "16px", resize: "vertical" },
  button: { padding: "10px", borderRadius: "5px", border: "none", backgroundColor: "#4caf50", color: "#fff", cursor: "pointer", fontWeight: "bold", fontSize: "16px", marginTop: "10px" },
  linksContainer: { display: "flex", gap: "10px", flexWrap: "wrap" },
  linksList: { marginTop: "10px" },
  linkItem: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px" },
  removeBtn: { marginLeft: "10px", backgroundColor: "#f44336", color: "#fff", border: "none", borderRadius: "3px", cursor: "pointer" }
};

export default Dashboard;
