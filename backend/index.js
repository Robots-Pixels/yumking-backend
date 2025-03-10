import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import bookingRouter from "./routes/booking.route.js";
import cors from "cors";


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({origin: "*"}));
app.use("/api/auth/", authRouter);
app.use("/api/booking/", bookingRouter);

mongoose
    .connect((process.env.MONGO_CREDENTIALS))
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(3000, () => {
            console.log("Server running on port 3000");
        });

    })
    .catch((error) => {
        console.log("Error while connecting to the DataBase : ", error);
})
