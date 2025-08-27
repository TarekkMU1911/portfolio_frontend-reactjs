import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

function Home() {
  const [portfolios, setPortfolios] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [myPortfolio, setMyPortfolio] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPortfolios(page);
  }, [page]);

  useEffect(() => {
    const uid = user?.id || user?._id || user?.userId;
    if (uid) fetchMyPortfolio(uid);
    else setMyPortfolio(null);
  }, [user]);

  const fetchPortfolios = async (pageNum) => {
    try {
      const res = await API.get(`/portfolio?page=${pageNum}&limit=6`);
      setPortfolios(res.data?.items ?? []);
      setTotalPages(res.data?.totalPages ?? 1);
    } catch {
      setPortfolios([]);
      setTotalPages(1);
    }
  };

  const fetchMyPortfolio = async (userId) => {
    try {
      const res = await API.get(`/portfolio?userId=${userId}&limit=1`);
      setMyPortfolio(res.data?.items?.[0] || null);
    } catch {
      setMyPortfolio(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleCreateOrShow = () => {
    if (myPortfolio?.id || myPortfolio?._id) {
      const pid = myPortfolio.id || myPortfolio._id;
      navigate(`/portfolio/${pid}`);
    } else {
      navigate("/portfolioCreation");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Portfolios</h1>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            <LogOut size={22} />
          </button>
        </div>

        {/* Portfolio Grid */}
        {portfolios.length === 0 ? (
          <p style={styles.emptyText}>No portfolios found.</p>
        ) : (
          <div style={styles.grid}>
            {portfolios.map((p) => {
              const pid = p.id || p._id;
              return (
                <div
                  key={pid}
                  style={styles.portfolioCard}
                  onClick={() => navigate(`/portfolio/${pid}`)}
                >
                  <h2 style={styles.username}>
                    {p.user?.username || p.name || "Portfolio"}
                  </h2>
                  <p style={styles.job}>{p.jobTitle || "-"}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Create/Show Button */}
        <button onClick={handleCreateOrShow} style={styles.button}>
          {myPortfolio ? "Show My Portfolio" : "Create Portfolio"}
        </button>

        {/* Pagination */}
        <div style={styles.pagination}>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            style={{
              ...styles.pageBtn,
              ...(page === 1 ? styles.disabledBtn : {}),
            }}
          >
            Previous
          </button>
          <span style={styles.pageInfo}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            style={{
              ...styles.pageBtn,
              ...(page === totalPages ? styles.disabledBtn : {}),
            }}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    background:
      "linear-gradient(135deg, #f7f9fc 0%, #80b895ff 50%, #e9eef5 100%)",
  },
  card: {
    width: "100%",
    maxWidth: "900px",
    backgroundColor: "#fff",
    borderRadius: "14px",
    padding: "32px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    border: "1px solid #eef0f3",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    margin: 0,
    color: "#222",
    fontSize: "26px",
    fontWeight: 700,
  },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px",
    borderRadius: "50%",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    cursor: "pointer",
    width: "50px",
    height : "50px",
  },
  emptyText: {
    color: "#6b7280",
    fontSize: "16px",
    textAlign: "center",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "20px",
  },
  portfolioCard: {
    background: "#fff",
    border: "1px solid #d9dee5",
    borderRadius: "12px",
    padding: "20px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
  },
  username: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111827",
  },
  job: {
    fontSize: "14px",
    marginTop: "6px",
    color: "#6b7280",
  },
  button: {
    padding: "14px 40px",
    fontSize: "16px",
    fontWeight: 700,
    borderRadius: "12px",
    border: "1px solid #2f7b3a",
    backgroundColor: "#2f7b3a",
    color: "#fff",
    cursor: "pointer",
    alignSelf: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    transition:
      "transform 120ms ease, box-shadow 160ms ease, filter 160ms ease",
  },
 pagination: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "16px",
    marginTop: "12px",
  },
  pageBtn: {
    padding: "10px 22px",
    borderRadius: "8px",
    border: "1px solid #2563eb",
    background: "#2563eb", // أزرق ثابت
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.2s ease",
  },
  disabledBtn: {
    background: "#cbd5e1", // رمادي فاتح
    border: "1px solid #cbd5e1",
    color: "#fff",
    cursor: "not-allowed",
    opacity: 0.7,
  },
  pageInfo: {
    minWidth: "100px",
    textAlign: "center",
    padding: "10px 18px",
    background: "#f3f4f6", // رمادي فاتح خلفية
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#111827", // أغمق عشان الرقم يبقى واضح
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
  },
};

export default Home;
