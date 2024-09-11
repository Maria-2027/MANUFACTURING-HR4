import mongoose from 'mongoose';
// Product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    required: true,
  },
  pricePerUnit: {
    type: Number,
    required: true,
  },
  stockQuantity: {
    type: Number,
    required: true,
    default: 0,
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vendor', // Reference to the Vendor (Supplier)
  },
  reorderLevel: {
    type: Number,
    required: true,
  },
  unitOfMeasurement: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', productSchema);
