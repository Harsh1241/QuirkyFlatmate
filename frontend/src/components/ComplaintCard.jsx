import React, { useState } from "react";

const ComplaintCard = ({ complaint, onVote }) => {
  const [upvotes, setUpvotes] = useState(complaint.upvotes);
  const [downvotes, setDownvotes] = useState(complaint.downvotes);

  const handleVote = async (complaintId, voteType) => {
    try {
      const userToken = localStorage.getItem("token");
      if (!userToken) {
        console.error("🔴 User token not found! User may not be logged in.");
        alert("Please log in to vote.");
        return;
      }
  
      console.log("Sending Vote:", { complaintId, type: voteType });
  
      const response = await fetch(`http://localhost:5000/api/complaints/${complaintId}/vote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": userToken, 
        },
        body: JSON.stringify({ type: voteType }),
      });
  
      const rawResponse = await response.text();
      console.log("Raw Response:", rawResponse);
  
      if (!response.ok) {
        throw new Error(`Server Error: ${response.status} ${response.statusText}`);
      }
  
      const data = JSON.parse(rawResponse);
      console.log("✅ Vote Response:", data);
  
      // ✅ Update state correctly
      setUpvotes(data.upvotes);
      setDownvotes(data.downvotes);
    } catch (error) {
      console.error("🔴 Error voting:", error.message);
    }
  };
  

  return (
    <div className="card shadow mb-4">
      <div className="card-body">
        <h3 className="card-title">{complaint.title}</h3>
        <p className="card-text">{complaint.description}</p>
        <div className="d-flex justify-content-between text-muted">
          <span>Type: {complaint.type}</span>
          <span>Severity: {complaint.severity}</span>
        </div>
        <div className="mt-3 d-flex gap-2">
          <button
            className="btn btn-success"
            onClick={() => handleVote(complaint._id, "upvote")} // ✅ Pass complaint ID
          >
            Upvote ({upvotes})
          </button>
          <button
            className="btn btn-danger"
            onClick={() => handleVote(complaint._id, "downvote")} // ✅ Pass complaint ID
          >
            Downvote ({downvotes})
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;
