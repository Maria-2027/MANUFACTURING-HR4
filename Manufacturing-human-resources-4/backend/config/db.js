import mongoose from "mongoose";

export const ConnectDB = async () => {
  await mongoose.connect(
    process.env.MONGODB
  ).then(() => console.log("Db Connected"));
};
