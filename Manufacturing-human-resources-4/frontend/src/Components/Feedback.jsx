import React, { useState, useEffect } from "react";

const ManufacturingFeedback = () => {
  const [loading, setLoading] = useState(true);

  const feedbackList = [
    {
      id: 1,
      name: "John Doe",
      comment: "The production process is seamless and efficient.",
      rating: 5,
    },
    {
      id: 2,
      name: "Jane Smith",
      comment: "Impressive quality control and packaging.",
      rating: 4,
    },
    {
      id: 3,
      name: "Mark Taylor",
      comment: "The system upgrade has significantly improved productivity.",
      rating: 5,
    },
  ];

  // Simulate a loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Set loading to false after 2 seconds
    }, 2000);

    return () => clearTimeout(timer); // Clean up timer on unmount
  }, []);

  return (
    <div style={styles.container}>
      {loading ? (
        <div style={styles.loadingContainer}>
          <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-gray-600 mb-4"></div>
          <p className="text-gray-600 text-xl">Loading...</p>
        </div>
      ) : (
        <>
          <h1 style={styles.header}>Feedback</h1>
          <div style={styles.feedbackSection}>
            {feedbackList.map((feedback) => (
              <div key={feedback.id} style={styles.feedbackCard}>
                <h3 style={styles.name}>{feedback.name}</h3>
                <p style={styles.comment}>"{feedback.comment}"</p>
                <p style={styles.rating}>Rating: ⭐ {feedback.rating} / 5</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    width: "100vw",
    padding: "20px",
    backgroundColor: "#f4f4f4",
    overflow: "hidden",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  header: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: "30px",
    color: "#222",
    textAlign: "center",
  },
  feedbackSection: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    maxHeight: "calc(100vh - 120px)",
    overflowY: "auto",
    padding: "10px",
  },
  feedbackCard: {
    width: "80%",
    maxWidth: "600px",
    padding: "20px",
    margin: "10px 0",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#fff",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  name: {
    fontSize: "1.6rem",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  comment: {
    fontStyle: "italic",
    color: "#444",
    marginBottom: "15px",
  },
  rating: {
    fontSize: "1.4rem",
    color: "#4CAF50",
    fontWeight: "bold",
  },
};

export default ManufacturingFeedback;
