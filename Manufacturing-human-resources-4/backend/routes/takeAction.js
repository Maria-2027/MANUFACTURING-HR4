import express from 'express';
// import multer from 'multer';
import ActionReport from '../models/ActionReport.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Ensure upload directory exists
// const uploadDir = 'uploads/action-reports';
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir, { recursive: true });
// }

// Configure multer for file uploads
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         // Create directory if it doesn't exist
//         fs.mkdirSync(uploadDir, { recursive: true });
//         cb(null, uploadDir);
//     },
//     filename: function (req, file, cb) {
//         // Sanitize filename
//         const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
//         cb(null, `action-report-${Date.now()}-${sanitizedFilename}`);
//     }
// });

// const upload = multer({ 
//     storage: storage,
//     fileFilter: (req, file, cb) => {
//         // Check file mimetype and extension
//         const filetypes = /pdf|application\/pdf/;
//         const mimetype = filetypes.test(file.mimetype);
//         const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

//         if (mimetype && extname) {
//             return cb(null, true);
//         }
//         cb(new Error('Only PDF files are allowed'));
//     },
//     limits: {
//         fileSize: 5 * 1024 * 1024 // 5MB limit
//     }
// }).single('actionReport');

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

        console.log('[DEBUG] Request body:', req.body);

        // Create action report with Cloudinary URL
        const actionReport = new ActionReport({
            reportId,
            complaintId: req.body.complaintId,
            actionType: req.body.actionType,
            status: req.body.status,
            assignedTo: req.body.assignedTo,
            priority: req.body.priority,
            dueDate: req.body.dueDate,
            followUpDate: req.body.followUpDate,
            resolution: req.body.resolution,
            comment: req.body.comment,
            notifyEmployee: req.body.notifyEmployee,
            reportFile: req.body.reportFile // Use Cloudinary URL directly
        });

        const savedReport = await actionReport.save();
        console.log('[DEBUG] Action report saved:', savedReport);

        res.status(201).json({
            success: true,
            message: 'Action report submitted successfully',
            data: savedReport
        });
    } catch (error) {
        console.error('[ERROR] Failed to submit action report:', error);
        res.status(500).json({
            success: false,
            message: 'Error submitting action report',
            error: error.message
        });
    }
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
router.put('/update-status/:reportId', async (req, res) => {
    try {
        const { reportId } = req.params;
        const { status } = req.body;

        // Validate status against the enum values from the schema
        if (!['Pending', 'In-Review', 'Resolved', 'Escalated'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        const updatedReport = await ActionReport.findOneAndUpdate(
            { reportId: reportId },
            { status: status },
            { 
                new: true,
                runValidators: true 
            }
        ).populate('complaintId');

        if (!updatedReport) {
            return res.status(404).json({
                success: false,
                message: 'Action report not found'
            });
        }

        console.log('[DEBUG] Status updated successfully:', {
            reportId: updatedReport.reportId,
            newStatus: status
        });

        res.status(200).json({
            success: true,
            message: 'Status updated successfully',
            data: updatedReport
        });

    } catch (error) {
        console.error('[ERROR] Failed to update status:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating status',
            error: error.message
        });
    }
});

export default router;
