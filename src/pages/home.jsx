import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

function Home() {
  const [portfolios, setPortfolios] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPortfolios(page);
  }, [page]);

  const fetchPortfolios = async (pageNum) => {
    try {
      const res = await API.get(`/portfolio?page=${pageNum}&limit=2`); 
      setPortfolios(res.data.items);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error("Error fetching portfolios:", err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleCreateOrShow = () => {
    const myPortfolio = portfolios.find((p) => p.user?.id === user?.id);
    if (myPortfolio) {
      navigate(`/portfolio/${user.id}`);
    } else {
      navigate("/portfolioCreation"); 
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      <div className="flex justify-between items-center p-4 bg-white shadow">
        <h1 className="text-2xl font-bold text-blue-600">Portfolios</h1>
        <button
          onClick={handleLogout}
          className="flex items-center justify-center p-3 rounded-full bg-red-500 hover:bg-red-600 text-white transition"
        >
          <LogOut size={22} />
        </button>
      </div>


      <div className="flex-1 flex flex-col items-center justify-start py-6 space-y-6">
        {portfolios.length === 0 ? (
          <p className="text-gray-500 text-lg">No portfolios found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4">
            {portfolios.map((portfolio) => (
              <div
                key={portfolio.id}
                className="p-5 border rounded-xl shadow hover:shadow-lg transition bg-white cursor-pointer"
                onClick={() => navigate(`/portfolio/${portfolio.user.id}`)}
              >
                <h2 className="text-lg font-semibold">{portfolio.user?.username}</h2>
                <p className="text-gray-600 mt-1">{portfolio.jobTitle}</p>
              </div>
            ))}
          </div>
        )}

 
        <button
          onClick={handleCreateOrShow}
          className="mt-4 px-8 py-4 text-white bg-blue-500 rounded-xl font-semibold text-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
        >
          {portfolios.find((p) => p.user?.id === user?.id)
            ? "Show My Portfolio"
            : "Create Portfolio"}
        </button>

        {/* paginaition */}
        <div className="flex space-x-2 mt-6">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2 bg-gray-100 rounded-lg">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
