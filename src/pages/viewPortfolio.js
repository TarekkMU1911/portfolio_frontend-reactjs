import React, { useEffect, useState } from "react";
import api from "../api";

function ViewPortfolioPage() {
  const [portfolio, setPortfolio] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await api.get("/portfolio/1"); 
        setPortfolio(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPortfolio();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>View Portfolio</h2>
      {portfolio ? (
        <div>
          <h3>{portfolio.title}</h3>
          <p>{portfolio.description}</p>
        </div>
      ) : (
        <p>Loading portfolio...</p>
      )}
    </div>
  );
}

export default ViewPortfolioPage;
