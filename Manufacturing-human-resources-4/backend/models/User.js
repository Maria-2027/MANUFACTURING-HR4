import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['employee', 'admin', 'superadmin'], 
    default: 'employee'
  }
});

// ❌ WRONG: export default mongoose.model("User", UserSchema);
// ✅ FIX: Named Export
const User = mongoose.model("User", UserSchema);
// export { User };  // <-- Named export
export default User;