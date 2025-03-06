import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRouter from "./routes/auth.route.js";
import bookingRouter from "./routes/booking.route.js";

dotenv.config();

const app = express();
app.use(express.json());
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
        console.log("Erreur de connexion à MongoDB : ", error);
})
