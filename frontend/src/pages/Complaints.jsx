import React, { useState, useEffect } from "react";
import axios from "axios";
import ComplaintCard from "../components/ComplaintCard";

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [newComplaint, setNewComplaint] = useState({
    title: "",
    description: "",
    type: "Noise",
    severity: "Mild",
    flatCode: "",
  });

  // Fetch complaints from the backend
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/complaints", {
          headers: { "x-auth-token": localStorage.getItem("token") },
        });

        console.log("🔹 Fetched Complaints Data:", response.data);
        setComplaints(response.data);
      } catch (err) {
        console.error("🔴 Error fetching complaints:", err.response?.data || err.message);
      }
    };
    fetchComplaints();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    console.log("🔹 Sending Complaint Data:", newComplaint);

    try {
      const response = await axios.post("http://localhost:5000/api/complaints", newComplaint, {
        headers: { "x-auth-token": token },
      });

      console.log("✅ Complaint Filed Successfully:", response.data);
      setComplaints([...complaints, response.data]);

      setNewComplaint({ title: "", description: "", type: "Noise", severity: "Mild", flatCode: "" });
    } catch (err) {
      console.error("🔴 Error filing complaint:", err.response?.data || err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-primary">Complaints</h1>

      {/* Complaint Form */}
      <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded bg-light">
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            value={newComplaint.title}
            onChange={(e) => setNewComplaint({ ...newComplaint, title: e.target.value })}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            value={newComplaint.description}
            onChange={(e) => setNewComplaint({ ...newComplaint, description: e.target.value })}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Type</label>
          <select
            value={newComplaint.type}
            onChange={(e) => setNewComplaint({ ...newComplaint, type: e.target.value })}
            className="form-select"
          >
            <option value="Noise">Noise</option>
            <option value="Cleanliness">Cleanliness</option>
            <option value="Bills">Bills</option>
            <option value="Pets">Pets</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Severity</label>
          <select
            value={newComplaint.severity}
            onChange={(e) => setNewComplaint({ ...newComplaint, severity: e.target.value })}
            className="form-select"
          >
            <option value="Mild">Mild</option>
            <option value="Annoying">Annoying</option>
            <option value="Major">Major</option>
            <option value="Nuclear">Nuclear</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Flat Code</label>
          <input
            type="text"
            value={newComplaint.flatCode}
            onChange={(e) => setNewComplaint({ ...newComplaint, flatCode: e.target.value })}
            className="form-control"
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          File Complaint
        </button>
      </form>

      {/* Display Complaints */}
      <div className="row">
        {Array.isArray(complaints) && complaints.length > 0 ? (
          complaints.map((complaint) => (
            <div className="col-md-6 mb-3" key={complaint._id}>
              <ComplaintCard complaint={complaint} />
            </div>
          ))
        ) : (
          <p className="text-muted">No complaints found.</p>
        )}
      </div>
    </div>
  );
};

export default Complaints;
