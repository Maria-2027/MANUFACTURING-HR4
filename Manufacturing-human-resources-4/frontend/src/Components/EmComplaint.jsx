import React, { useState } from "react";

const EmComplaint = ({ user }) => {
  const [fullName, setFullName] = useState(`${user?.firstname || ""} ${user?.lastname || ""}`.trim()); // ✅ Editable name field
  const [complaint, setComplaint] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [notification, setNotification] = useState("");

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("FullName", fullName); // ✅ Send editable name
    formData.append("ComplaintDescription", complaint);
    if (attachment) {
      formData.append("File", attachment);
    }

    try {
      const response = await fetch("http://localhost:7688/api/auth/EmComplaint", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setNotification("Complaint successfully submitted!");
      } else {
        setNotification("Error: " + data.error);
      }
    } catch (error) {
      setNotification("Server error, please try again.");
    }

    // Reset form after submission
    setComplaint("");
    setAttachment(null);

    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification("");
    }, 3000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-xl shadow-xl">
      <div className="flex mb-8 space-x-10">
        <div className="w-1/2 pr-10">
          <h1 className="text-4xl font-bold text-blue-600 mb-6">Employee Complaint</h1>

          {notification && (
            <div className="p-4 mb-6 text-center text-white bg-green-600 rounded-lg shadow-xl">
              {notification}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-2">Your Name</label>
              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all duration-300 ease-in-out shadow-md"
                value={fullName} // ✅ Bind value to state
                onChange={(e) => setFullName(e.target.value)} // ✅ Make input editable
                required
              />
            </div>

            <div>
              <textarea
                className="w-full p-5 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all duration-300 ease-in-out shadow-md"
                rows="5"
                placeholder="Describe your complaint..."
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                required
              ></textarea>
            </div>

            <div>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full border-2 border-gray-300 p-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-400 transition-all duration-300 ease-in-out shadow-md"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-500 text-white py-4 rounded-xl hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-500 transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg"
            >
              Submit Complaint
            </button>
          </form>
        </div>

        <div className="w-1/2 pl-10 flex items-center justify-center">
          <p className="text-xl font-light text-gray-700 leading-relaxed text-justify">
            We highly value your feedback. Please take a moment to describe the issue you're facing. 
            Attach any relevant files, and we will address your concerns promptly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmComplaint;
