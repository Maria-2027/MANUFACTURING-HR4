import express from 'express';
import mongoose from 'mongoose';  // Add this import
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
        .map((entry) => ({
          time_in: entry.time_in,
          time_out: entry.time_out,
          employee_id: entry.employee_id,
          overtime_hours: entry.overtime_hours,
          employee_fullname: entry.employee_fullname || "Unknown",
          total_hours: entry.total_hours,
          status: entry.status,
          approved_at: entry.approved_at,
          position: entry.position || "Unknown Position",
          minutes_late: entry.minutes_late || 0
        }));
  
      console.log("Filtered data:", filteredData);
  
      // Save filtered data to MongoDB
      for (const entry of filteredData) {
        try {
          const existingRecord = await Employee.findOne({
            employee_id: entry.employee_id,
            time_in: entry.time_in,
          });
  
          if (!existingRecord) {
            await Employee.create(entry);
          }
        } catch (err) {
          console.error(`Error saving entry for employee ${entry.employee_id}:`, err);
          // Continue with next entry
          continue;
        }
      }
  
      res.status(200).json({ 
        message: "Data successfully saved!", 
        data: filteredData 
      });
    } catch (err) {
      console.error("Error fetching/saving data:", err);
      res.status(500).json({ error: "Server Error", details: err.message });
    }
});

integrationRoutes.get("/hr4-announcement", async (req, res) => {
    try {
        const serviceToken = generateServiceToken();
        const apiUrl = process.env.APP_API_URL; 

        // Get API announcements
        const response = await axios.get(`${apiUrl}/admin/hr4-announcement`, {
            headers: {
                Authorization: `Bearer ${serviceToken}`,
            },
        });

        // Get local announcements
        const localAnnouncements = await Announcement.find().lean();

        // Create a map of existing announcements by ID to prevent duplicates
        const existingAnnouncementsMap = new Map();
        localAnnouncements.forEach(ann => {
            existingAnnouncementsMap.set(ann._id, ann);
        });

        // Process API announcements
        const processedAnnouncements = [];
        for (const apiAnn of response.data) {
            // Check if we already have this announcement locally
            let finalAnnouncement = existingAnnouncementsMap.get(apiAnn._id);

            if (!finalAnnouncement) {
                // Create new announcement if it doesn't exist
                const newAnnouncement = new Announcement({
                    _id: apiAnn._id,
                    title: apiAnn.title,
                    content: apiAnn.content,
                    date: apiAnn.date || new Date(),
                    likes: 0,
                    likedBy: [],
                    comments: []
                });
                await newAnnouncement.save();
                finalAnnouncement = newAnnouncement.toObject();
            }

            processedAnnouncements.push({
                ...apiAnn,
                _id: finalAnnouncement._id,
                likes: finalAnnouncement.likes || 0,
                likedBy: finalAnnouncement.likedBy || [],
                comments: finalAnnouncement.comments || []
            });
        }

        // Sort by date descending (newest first)
        processedAnnouncements.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.status(200).json(processedAnnouncements);
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ error: "Server Error", details: err.message });
    }
});

integrationRoutes.patch('/hr4-announcement/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { action, userId, userName, comment, title, content } = req.body;

        // Find or create announcement
        let announcement = await Announcement.findById(id);
        
        if (!announcement) {
            announcement = new Announcement({
                _id: id,
                title,
                content,
                date: new Date(),
                likes: 0,
                likedBy: [],
                comments: []
            });
        }

        // Preserve existing data
        announcement.title = title || announcement.title;
        announcement.content = content || announcement.content;

        if (action === 'comment') {
            // Ensure comments array exists
            if (!announcement.comments) {
                announcement.comments = [];
            }

            const newComment = {
                _id: new mongoose.Types.ObjectId().toString(),
                userId,
                userName,
                text: comment.text,
                timestamp: new Date(),
                parentId: comment.parentId || null
            };

            if (comment.parentId) {
                const parentComment = announcement.comments.find(c => 
                    c._id.toString() === comment.parentId
                );
                if (parentComment) {
                    newComment.repliedToUser = parentComment.userName;
                }
            }

            // Add to comments array
            announcement.comments.push(newComment);
            announcement.markModified('comments'); // Mark comments as modified
        } else if (action === 'like') {
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

        // Save and get fresh copy
        await announcement.save();
        const updatedAnnouncement = await Announcement.findById(id).lean();
        
        if (!updatedAnnouncement) {
            throw new Error('Failed to retrieve updated announcement');
        }

        res.json(updatedAnnouncement);
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
