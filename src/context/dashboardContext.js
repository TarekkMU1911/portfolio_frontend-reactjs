import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const PortfolioContext = createContext();

export function PortfolioProvider({ children, username }) {
  const [portfolio, setPortfolio] = useState({
    username: username || "",
    email: "",
    firstName: "",
    lastName: "",
    jobTitle: "",
    description: "",
    phoneNumber: "",
    main: "",
    cover: "",
    cv: "",
    links: []
  });

  useEffect(() => {
    if (!username) return;
    const fetchPortfolio = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/portfolio/share/${username}`);
        if (res.data) setPortfolio(res.data);
      } catch (err) {
        console.error("Error fetching portfolio:", err);
      }
    };
    fetchPortfolio();
  }, [username]);

  const updatePortfolio = async (newPortfolio) => {
    setPortfolio(prev => ({ ...prev, ...newPortfolio }));
    try {
      await axios.put(`http://localhost:3000/portfolio/share/${username}`, { ...portfolio, ...newPortfolio });
      console.log("Portfolio updated in DB");
    } catch (err) {
      console.error("Error updating portfolio:", err);
    }
  };

  return (
    <PortfolioContext.Provider value={{ portfolio, setPortfolio, updatePortfolio }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}
