import { useEffect, useState } from "react";

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/leaderboard")
      .then((res) => res.json())
      .then((data) => setLeaderboard(data))
      .catch((err) => console.error("Error fetching leaderboard:", err));
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th> {/* ✅ Display username correctly */}
          <th>Karma Points</th>
        </tr>
      </thead>
      <tbody>
        {leaderboard.map((user, index) => (
          <tr key={user._id}>
            <td>{index + 1}</td> {/* Rank */}
            <td>{user.username}</td> {/* ✅ Use `username`, not `name` */}
            <td>{user.karmaPoints}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Leaderboard;
