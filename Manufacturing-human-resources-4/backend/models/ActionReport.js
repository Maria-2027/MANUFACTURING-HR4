import mongoose from 'mongoose';

const actionReportSchema = new mongoose.Schema({
    reportId: {
        type: String,
        unique: true,
        required: true
    },
    complaintId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Complaint'
    },
    comment: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'in-review', 'resolved', 'escalated'],
        default: 'pending'
    },
    assignedTo: {
        type: String,
        required: true
    },
    actionType: {
        type: String,
        required: true,
        enum: [
            'Investigation Required',
            'Immediate Resolution',
            'Mediation Required',
            'Policy Review',
            'Training/Education Required',
            'Disciplinary Action',
            'No Action Required'
        ]
    },
    priority: {
        type: String,
        enum: ['high', 'medium', 'low'],
        required: true
    },
    dueDate: {
        type: Date
    },
    followUpDate: {
        type: Date
    },
    resolution: {
        type: String
    },
    notifyEmployee: {
        type: Boolean,
        default: false
    },
    reportFile: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('ActionReport', actionReportSchema);
