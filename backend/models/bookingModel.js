import mongoose, { mongo } from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        guest: {
            type: Number,
            required: true,
        },
        day: {
            type: String,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: false,
            sparse: true
        },
    },
    {
        timestamps: true
    }
);

const Booking = new mongoose.model("Booking", bookingSchema);
export default Booking;
