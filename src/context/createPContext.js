// createPContext.js
import { createContext, useContext, useState } from "react";
import axios from "axios";

const PortfolioContext = createContext();

export function PortfolioProvider({ children }) {
  const [portfolio, setPortfolio] = useState(null);

  // Initialize new portfolio with user id
  const initializePortfolio = (id) => {
    setPortfolio({
      userId: id,
      firstName: "",
      lastName: "",
      name: "",
      email: "",
      jobTitle: "",
      description: "",
      phone: "",
      links: [], // array of { platform, url }
      mainPicprofileture: null,
      coverPicture: null,
      cv: null,
    });
  };



const createPortfolio = async (portfolioData) => {
  try {
    const formData = new FormData();
    formData.append("name", portfolioData.name);
    formData.append("jobTitle", portfolioData.jobTitle);
    formData.append("description", portfolioData.description);
    formData.append("email", portfolioData.email);
    formData.append("phoneNumber", portfolioData.phoneNumber);

    // links must be array of strings
    if (Array.isArray(portfolioData.links)) {
      portfolioData.links.forEach(link => formData.append("links", link));
    }

    if (portfolioData.mainPicture) {
      formData.append("mainPicture", portfolioData.mainPicture);
    }
    if (portfolioData.coverPicture) {
      formData.append("coverPicture", portfolioData.coverPicture);
    }
    if (portfolioData.cv) {
      formData.append("cv", portfolioData.cv);
    }

    // ✅ userId goes in the URL, not in the form body
    const response = await axios.post(
      `http://localhost:3000/portfolio/${portfolioData.userId}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    console.log("Portfolio created:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error creating portfolio:", error.response?.data || error.message);
  }
};






  const updatePortfolio = async (portfolioData) => {
    try {
      if (!portfolio?.id) {
        // no existing portfolio → create new
        return await createPortfolio(portfolioData);
      }

      const formData = new FormData();
      formData.append("name", portfolioData.name || "");
      formData.append("jobTitle", portfolioData.jobTitle || "");
      formData.append("description", portfolioData.description || "");
      formData.append("email", portfolioData.email || "");
      formData.append("phoneNumber", portfolioData.phone || "");
      formData.append("links", JSON.stringify(portfolioData.links || []));

      if (portfolioData.mainPicture) {
        formData.append("mainPicture", portfolioData.mainPicture);
      }
      if (portfolioData.coverPicture) {
        formData.append("coverPicture", portfolioData.coverPicture);
      }
      if (portfolioData.cv) {
        formData.append("cv", portfolioData.cv);
      }

      const res = await axios.put(
        `http://localhost:3000/portfolio/${portfolio.id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setPortfolio(res.data);
      return res.data;
    } catch (err) {
      console.error("Error updating portfolio:", err.response?.data || err.message);
      throw err;
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        portfolio,
        setPortfolio,
        initializePortfolio,
        createPortfolio,
        updatePortfolio,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  return useContext(PortfolioContext);
}
