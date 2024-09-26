import mongoose from "mongoose";

 const ConnectDB = async () => {
  await mongoose
    .connect(process.env.MONGODB)
    .then(() => console.log("Db Connected"));
};

export default ConnectDB;