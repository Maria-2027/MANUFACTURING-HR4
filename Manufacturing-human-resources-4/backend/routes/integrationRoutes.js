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
        const apiUrl = process.env.APP_API_URL; 

        if (!apiUrl) {
            throw new Error("API URL is not defined in .env file");
        }

        const response = await axios.get(`${apiUrl}/admin/hr4-announcement`, {
            headers: {
                Authorization: `Bearer ${serviceToken}`,
            },
        });

        // Get all announcements from local database to merge likes data
        const localAnnouncements = await Announcement.find();
        
        const mergedAnnouncements = response.data.map(apiAnn => {
            const localAnn = localAnnouncements.find(local => 
                local.title === apiAnn.title && local.content === apiAnn.content
            );
            
            return {
                ...apiAnn,
                _id: localAnn?._id || apiAnn._id,
                likes: localAnn?.likes || 0,
                likedBy: localAnn?.likedBy || [],
                comments: localAnn?.comments || []
            };
        });

        console.log("Merged announcements with likes:", mergedAnnouncements);
        res.status(200).json(mergedAnnouncements);
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ error: "Server Error", details: err.message });
    }
});

integrationRoutes.patch('/hr4-announcement/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { action, userId, userName } = req.body;

        let announcement = await Announcement.findById(id);
        if (!announcement) {
            // If announcement doesn't exist in local DB, create it
            announcement = new Announcement({
                _id: id,
                title: req.body.title,
                content: req.body.content,
                likes: 0,
                likedBy: [],
                comments: []
            });
        }

        // Initialize if they don't exist
        announcement.likes = announcement.likes || 0;
        announcement.likedBy = announcement.likedBy || [];

        if (action === 'like') {
            if (!announcement.likedBy.includes(userId)) {
                announcement.likes += 1;
                announcement.likedBy.push(userId);
            }
        } else if (action === 'unlike') {
            if (announcement.likedBy.includes(userId)) {
                announcement.likes = Math.max(0, announcement.likes - 1);
                announcement.likedBy = announcement.likedBy.filter(id => id !== userId);
            }
        }

        const savedAnnouncement = await announcement.save();
        
        // Return enhanced response
        res.json({
            ...savedAnnouncement.toObject(),
            isLiked: savedAnnouncement.likedBy.includes(userId),
            likeCount: savedAnnouncement.likes,
            userLiked: true
        });
    } catch (error) {
        console.error('Error updating announcement:', error);
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