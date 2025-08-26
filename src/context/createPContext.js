import { createContext, useContext, useState } from "react";
import API from "../services/api";

const PortfolioContext = createContext();

export function PortfolioProvider({ children }) {
  const [portfolio, setPortfolio] = useState(null);

  const initializePortfolio = (userId) => {
    setPortfolio({
      userId,
      firstName: "",
      lastName: "",
      name: "",
      email: "",
      jobTitle: "",
      description: "",
      phone: "",
      links: [],
      profileImage: null,
      coverImage: null,
      cv: null,
    });
  };

  const createPortfolio = async (portfolioData) => {
    try {
      const uid = portfolioData?.userId ?? portfolio?.userId ?? portfolioData?.uid;
      if (!uid) throw new Error("Missing userId");

      try {
        const res1 = await API.get(`/portfolio/user/${uid}`);
        if (res1.data?.id || res1.data?._id) {
          setPortfolio(res1.data);
          return res1.data;
        }
      } catch {}

      try {
        const res2 = await API.get(`/portfolio?userId=${uid}&limit=1`);
        const existing = res2.data?.items?.[0];
        if (existing?.id || existing?._id) {
          setPortfolio(existing);
          return existing;
        }
      } catch {}

      const formData = new FormData();
      formData.append("name", portfolioData.name ?? "");
      formData.append("jobTitle", portfolioData.jobTitle ?? "");
      formData.append("description", portfolioData.description ?? "");
      formData.append("email", portfolioData.email ?? "");
      formData.append("phone", portfolioData.phone ?? "");
      const links = Array.isArray(portfolioData.links) ? portfolioData.links : [];
      const urls = links.map(l => (typeof l === "string" ? l : l?.url)).filter(Boolean);
      formData.append("links", JSON.stringify(urls));
      if (portfolioData.profileImage) formData.append("profileImage", portfolioData.profileImage);
      if (portfolioData.coverImage) formData.append("coverImage", portfolioData.coverImage);
      if (portfolioData.cv) formData.append("cv", portfolioData.cv);

      const res = await API.post(`/portfolio/${uid}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPortfolio(res.data);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  const updatePortfolio = async (portfolioData) => {
    try {
      if (!portfolio?.id && !portfolio?._id) {
        return await createPortfolio({
          ...portfolioData,
          userId: portfolioData?.userId ?? portfolio?.userId,
        });
      }

      const formData = new FormData();
      formData.append("name", portfolioData.name ?? "");
      formData.append("jobTitle", portfolioData.jobTitle ?? "");
      formData.append("description", portfolioData.description ?? "");
      formData.append("email", portfolioData.email ?? "");
      formData.append("phone", portfolioData.phone ?? "");
      const links = Array.isArray(portfolioData.links) ? portfolioData.links : [];
      const urls = links.map(l => (typeof l === "string" ? l : l?.url)).filter(Boolean);
      formData.append("links", JSON.stringify(urls));
      if (portfolioData.profileImage) formData.append("profileImage", portfolioData.profileImage);
      if (portfolioData.coverImage) formData.append("coverImage", portfolioData.coverImage);
      if (portfolioData.cv) formData.append("cv", portfolioData.cv);

      const id = portfolio?.id || portfolio?._id;
      const res = await API.put(`/portfolio/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setPortfolio(res.data);
      return res.data;
    } catch (err) {
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