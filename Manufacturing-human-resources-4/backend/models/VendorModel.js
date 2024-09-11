import mongoose from 'mongoose';

// Vendor Schema
const vendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contactPerson: {
    type: String,
    required: true,
  },
  contactEmail: {
    type: String,
    required: true,
    unique: true,
  },
  contactPhone: {
    type: String,
    required: true,
  },
  address: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    country: String,
  },
  productsSupplied: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      productName: String,
      quantityAvailable: Number,
      pricePerUnit: Number,
    },
  ],
  rating: {
    type: Number,
    min: 0,
    max: 5,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  },
  contractDetails: {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    terms: {
      type: String,
    },
  },
  paymentDetails: {
    paymentMethod: {
      type: String,
      enum: ['Bank Transfer', 'Credit Card', 'PayPal', 'Cheque'],
    },
    bankAccount: {
      accountNumber: String,
      bankName: String,
      swiftCode: String,
      iban: String,
    },
  },
  transactions: [
    {
      transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
      date: Date,
      amount: Number,
      status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Vendor', vendorSchema);
