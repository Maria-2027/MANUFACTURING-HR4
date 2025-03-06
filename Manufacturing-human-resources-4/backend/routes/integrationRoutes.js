import express from 'express';
import axios from 'axios';
import { generateServiceToken } from "../middleware/gatewayTokenGenerator.js";

const integrationRoutes = express.Router();

integrationRoutes.get("/get-time-tracking", async (req, res) => {
    try {
        const serviceToken = generateServiceToken();
        
        // Use the correct environment variable here
        const apiUrl = process.env.APP_API_URL; 

        if (!apiUrl) {
            throw new Error("API URL is not defined in .env file");
        }

        const response = await axios.get(`${apiUrl}/hr1/get-time-tracking`, {
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

export default integrationRoutes;
