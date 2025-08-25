import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Portfolio() {
  const { username } = useParams();
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`http://localhost:3000/portfolio/${username}`);
      setPortfolio(res.data);
    };
    fetchData();
  }, [username]);

  if (!portfolio) return <div>Loading...</div>;

  return (
    <div className="container">
      <img src={portfolio.cover} alt="Cover" style={{width:"100%"}}/>
      <img src={portfolio.main} alt="Profile" style={{width:"150px", borderRadius:"50%"}}/>
      <h1>{portfolio.name}</h1>
      <h2>{portfolio.jobTitle}</h2>
      <p>{portfolio.description}</p>
      <p>Email: {portfolio.email}</p>
      <p>Phone: {portfolio.phone}</p>
      {portfolio.links?.map((link, i) => <div key={i}><a href={link}>{link}</a></div>)}
      {portfolio.cv && <div><a href={portfolio.cv} target="_blank">Download CV</a></div>}
      <p>Views: {portfolio.views}</p>
    </div>
  );
}

export default Portfolio;
