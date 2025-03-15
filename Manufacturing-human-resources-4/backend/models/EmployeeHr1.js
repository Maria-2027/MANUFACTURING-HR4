import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  employee_id: {
    type: String,
    required: true,
    unique: false, // Not unique since employees can have multiple records
  },
  employee_firstname: {
    type: String,
    required: true,
  },
  employee_lastname: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  time_in: {
    type: Date,
    required: true,
  },
  time_out: {
    type: Date,
    required: true,
  },
  minutes_late: {
    type: Number,
    required: true,
    default: 0,
  },
  totalHours: {
    type: Number,
    required: true,
    default: 0, // Default value if calculation fails
  },
});

// Middleware to calculate totalHours before saving
employeeSchema.pre("save", function (next) {
  if (this.time_in && this.time_out) {
    const timeIn = new Date(this.time_in);
    const timeOut = new Date(this.time_out);
    const diffInMs = timeOut - timeIn;
    this.totalHours = diffInMs / (1000 * 60 * 60); // Convert ms to hours
  }
  next();
});

// Ensure no duplicate records for the same employee on the same time_in
employeeSchema.index({ employee_id: 1, time_in: 1 }, { unique: true });

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;