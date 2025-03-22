import express from 'express';
import axios from 'axios';
import { generateServiceToken } from "../middleware/gatewayTokenGenerator.js";
import Employee from "../models/EmployeeHr1.js";
import Announcement from "../models/Announcement.js";  // Add this import
import { predictTopEmployee } from "../ai/tensorFlow.js";

const integrationRoutes = express.Router();

integrationRoutes.get("/get-time-tracking", async (req, res) => {
    try {
      const serviceToken = generateServiceToken();
      const apiUrl = process.env.APP_API_URL;
  
      if (!apiUrl) {
        throw new Error("API URL is not defined in .env file");
      }
  
      const response = await axios.get(`${apiUrl}/hr1/get-time-tracking`, {
        headers: {
          Authorization: `Bearer ${serviceToken}`,
        },
      });
  
      // Filter only approved entries
      const filteredData = response.data
        .filter((entry) => entry.status.toLowerCase() === "approved")
        .map(
          ({
            time_in,
            time_out,
            employee_id,
            employee_firstname,
            employee_lastname,
            position,
            minutes_late,
          }) => ({
            time_in,
            time_out,
            employee_id,
            employee_firstname,
            employee_lastname,
            position,
            minutes_late,
          })
        );
  
      console.log("Filtered data:", filteredData);
  
      // Save filtered data to MongoDB
      for (const entry of filteredData) {
        // Check if record already exists (to prevent duplicates)
        const existingRecord = await Employee.findOne({
          employee_id: entry.employee_id,
          time_in: entry.time_in, // Ensuring the same entry isn't duplicated
        });
  
        if (!existingRecord) {
          await Employee.create(entry);
        }
      }
  
      res
        .status(200)
        .json({ message: "Data successfully saved!", data: response.data });
    } catch (err) {
      console.error("Error fetching/saving data:", err);
      res.status(500).json({ error: "Server Error", details: err.message });
    }
  });

integrationRoutes.get("/hr4-announcement", async (req, res) => {
    try {
        const serviceToken = generateServiceToken();
        
        // Use the correct environment variable here
        const apiUrl = process.env.APP_API_URL; 

        if (!apiUrl) {
            throw new Error("API URL is not defined in .env file");
        }

        const response = await axios.get(`${apiUrl}/admin/hr4-announcement`, {
            headers: {
                Authorization: `Bearer ${serviceToken}`,
            },
        });

        console.log("Fetched data:", response.data);

        res.status(200).json(response.data);
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ error: "Server Error", details: err.message });
    }
});

integrationRoutes.patch('/hr4-announcement/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedAnnouncement = await Announcement.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedAnnouncement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    res.json(updatedAnnouncement);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update announcement', details: error.message });
  }
});

integrationRoutes.get("/get-employee-violation", async (req, res) => {
    try {
        const serviceToken = generateServiceToken();
        
        // Use the correct environment variable here
        const apiUrl = process.env.APP_API_URL; 

        if (!apiUrl) {
            throw new Error("API URL is not defined in .env file");
        }

        const response = await axios.get(`${apiUrl}/hr3/get-employee-violation`, {
            headers: {
                Authorization: `Bearer ${serviceToken}`,
            },
        });

        console.log("Fetched data:", response.data);

        res.status(200).json(response.data);
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ error: "Server Error", details: err.message });
    }
});

integrationRoutes.get("/trainings", async (req, res) => {
    try {
        const serviceToken = generateServiceToken();
        
        // Use the correct environment variable here
        const apiUrl = process.env.APP_API_URL; 

        if (!apiUrl) {
            throw new Error("API URL is not defined in .env file");
        }

        const response = await axios.get(`${apiUrl}/hr2/api/trainings`, {
            headers: {
                Authorization: `Bearer ${serviceToken}`,
            },
        });

        console.log("Fetched data:", response.data);

        res.status(200).json(response.data);
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ error: "Server Error", details: err.message });
    }
});

integrationRoutes.get("/top-employee", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
  
      if (!startDate || !endDate) {
        return res
          .status(400)
          .json({ error: "Start date and end date are required" });
      }
  
      const employees = await Employee.find();
  
      if (employees.length === 0) {
        return res.status(404).json({ message: "No employees found" });
      }
  
      const topEmployee = await predictTopEmployee(employees, startDate, endDate);
  
      if (!topEmployee) {
        return res
          .status(404)
          .json({ message: "No top employee found in the selected date range" });
      }
  
      res.json(topEmployee);
    } catch (err) {
      console.error("Error fetching data:", err);
      res.status(500).json({ error: "Server Error", details: err.message });
    }
  });

export default integrationRoutes;
