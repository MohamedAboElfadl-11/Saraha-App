import mongoose from "mongoose";

const database_connection = function () {
  try {
    mongoose.connect(process.env.DB_URI);
    console.log("Database connected ✅");
  } catch (error) {
    console.log("Error ==> ", error);
  }
};

export default database_connection;
