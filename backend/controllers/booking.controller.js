import Booking from "../models/bookingModel.js";
import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { validBookingDate } from "../utils/validateBookingDate.js";

export const newBooking = async (req, res) => {
    const {countryCode, telephone, password, guest, day, time, message} = req.body;

    if (message === ""){
        req.body.message = undefined;
    }
    if (!validBookingDate(day, time)){
        return res.status(400).json({
            message: "Booking date or Time is incorrect!",
            success: false
        });
    }

    try {
        const userFound = await User.findOne({
            $and: [{countryCode:countryCode.replace(/\s+/g, "")}, {telephone:telephone.replace(/\s+/g, "")}]
        });
        
        if(!userFound){
            return res.status(400).json({
                message: "User not found. Invalid phone number or password",
                success: false
            });
        }

        const authentifiedUser = bcryptjs.compareSync(password, userFound.password);

        if (!authentifiedUser){
            return res.status(400).json({
                message: "User not found. Invalid phone number or password",
                success: false
            });
        }
        
        const newBooking =  new Booking({
            userId: userFound._id,
            message: ((!req.body.message || req.body.message === "" ) ? undefined : req.body.message), 
            guest,
            day,
            time
        })

        newBooking.save();
        
        res.
        status(200).
        json(
            {   
                success: true,
                message: "Booking Added",
                booking: newBooking
            }
        )

    } catch (error) {
        return res.status(400).json({
            message: "Something went wrong. Please try again.",
            success: false
        });
    }

}