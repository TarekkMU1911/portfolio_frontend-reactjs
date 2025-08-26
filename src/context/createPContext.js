import { createContext, useContext, useState } from "react";
import axios from "axios";

const PortfolioContext = createContext();

export function PortfolioProvider({ children, userId }) {
  const [portfolio, setPortfolio] = useState(null);

  // Initialize new portfolio if none exists
  const initializePortfolio = (id) => {
    setPortfolio({
      userId: id,
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      jobTitle: "",
      description: "",
      phoneNumber: "",
      main: "",
      cover: "",
      cv: "",
      links: [],
    });
  };

const createPortfolio = async (userId, formData) => {
  try {
    const res = await axios.post(
      `http://localhost:3000/user/${userId}/portfolio`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    setPortfolio(res.data);
    return res.data;
  } catch (error) {
    throw error;
  }
};


  const updatePortfolio = async (formData) => {
    try {
      if (!portfolio?.id) {
        return await createPortfolio(formData); // create if not exists
      }
      const res = await axios.put(
        `http://localhost:3000/user/${userId}/portfolio/${portfolio.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setPortfolio(res.data);
      return res.data;
    } catch (err) {
      console.error("Error updating portfolio:", err.response?.data || err);
      throw err;
    }
  };

return (
  <PortfolioContext.Provider value={{ portfolio, setPortfolio, createPortfolio, updatePortfolio, initializePortfolio }}>
    {children}
  </PortfolioContext.Provider>
);

}

export function usePortfolio() {
  return useContext(PortfolioContext);
}
