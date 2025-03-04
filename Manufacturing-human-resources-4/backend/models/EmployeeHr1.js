// models/Employee.js
import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  hireDate: {
    type: Date,
    required: true,
  },
});

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
