import React, { useEffect, useState } from "react";
import axios from "axios";

const Leaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");
        if (!token) {
          setError("Unauthorized: No token found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:5000/api/leaderboard", {
          headers: { "x-auth-token": token },
        });

        console.log("✅ Fetched Leaderboard Data:", response.data);

        setLeaders(response.data);
      } catch (err) {
        console.error("🔴 Error fetching leaderboard:", err.response?.data || err.message);
        setError(err.response?.data?.msg || "Failed to load leaderboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-primary">Leaderboard</h2>

      {loading && <p className="text-muted">Loading leaderboard...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && leaders.length > 0 ? (
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Karma Points</th>
            </tr>
          </thead>
          <tbody>
            {leaders.map((leader, index) => (
              <tr key={leader._id}>
                <td>{index + 1}</td>
                <td className="fw-bold">{leader.name || leader.username || "Unknown"}</td>
                <td>{leader.karmaPoints}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p className="text-muted">No leaderboard data available.</p>
      )}
    </div>
  );
};

export default Leaderboard;
