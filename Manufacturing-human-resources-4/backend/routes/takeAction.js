import express from 'express';
import multer from 'multer';
import ActionReport from '../models/ActionReport.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Ensure upload directory exists
const uploadDir = 'uploads/action-reports';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Create directory if it doesn't exist
        fs.mkdirSync(uploadDir, { recursive: true });
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Sanitize filename
        const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, `action-report-${Date.now()}-${sanitizedFilename}`);
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Check file mimetype and extension
        const filetypes = /pdf|application\/pdf/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only PDF files are allowed'));
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
}).single('actionReport');

// Add error handling middleware
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        return res.status(400).json({
            success: false,
            message: 'File upload error',
            error: error.message
        });
    }
    next(error);
});

// POST route to submit action report
router.post('/submit-action', async (req, res) => {
    upload(req, res, async function(err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                success: false,
                message: 'File upload error',
                error: err.message
            });
        } else if (err) {
            return res.status(400).json({
                success: false,
                message: err.message || 'Unknown error occurred'
            });
        }

        try {
            // Generate random 4-digit number
            const randomNum = Math.floor(1000 + Math.random() * 9000);
            let reportId = `EMP-${randomNum}`;
            
            // Check if reportId already exists
            let existingReport = await ActionReport.findOne({ reportId });
            while (existingReport) {
                const newRandomNum = Math.floor(1000 + Math.random() * 9000);
                reportId = `EMP-${newRandomNum}`;
                existingReport = await ActionReport.findOne({ reportId });
            }
            
            const actionReport = new ActionReport({
                ...req.body,
                reportId,
                reportFile: req.file ? req.file.path : null
            });

            const savedReport = await actionReport.save();

            res.status(201).json({
                success: true,
                message: 'Action report submitted successfully',
                data: savedReport
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error submitting action report',
                error: error.message
            });
        }
    });
});

// GET route to retrieve all action reports
router.get('/get-actions', async (req, res) => {
    try {
        const reports = await ActionReport.find().populate('complaintId');
        res.status(200).json({
            success: true,
            data: reports
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error retrieving action reports',
            error: error.message
        });
    }
});

// PATCH route to update action status
router.patch('/update-action', async (req, res) => {
    try {
        const { complaintId, status } = req.body;
        const updatedReport = await ActionReport.findOneAndUpdate(
            { complaintId },
            { status },
            { new: true }
        );

        if (!updatedReport) {
            return res.status(404).json({
                success: false,
                message: 'Action report not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Status updated successfully',
            data: updatedReport
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating status',
            error: error.message
        });
    }
});

export default router;
