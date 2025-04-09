import express from 'express'; 
import { submitComplaint } from '../controllers/complaintController.js';
import verifyToken from '../middleware/messageMiddleware.js';
import multer from "multer";

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/') // Make sure this directory exists
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname)
    }
  })
});

// POST: Create a new complaint
router.post('/api/EmComplaint', upload.single('File'), verifyToken, submitComplaint);

// GET: Get all complaints
router.get('/EmComplaint', upload.single('File'), verifyToken, async (req, res) => {
  try {
    const complaints = await ComplaintUser.find();
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching complaints' });
  }
});

export default router;
