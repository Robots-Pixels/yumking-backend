import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { validatePhoneNumber } from "../utils/validatePhoneNumber.js";
import jwt from "jsonwebtoken";


export const signup = async (req, res) => {
    const {name, countryCode, telephone, email, password} = req.body;

    if (!name || !telephone || !password || !countryCode){
        return res.status(400).json({
            message: "All the fields with '*' are required!",
            success: false
        });
    }

    if (!validatePhoneNumber(telephone, countryCode)){
        return res.status(400).json({
            message: "Your phone number is invalid!",
            success: false
        })
    }

    // if (!req.body.email || req.body.email.trim() === "") {
    //     req.body.email = undefined;
    //     email = req.body.email;
    // }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    try {
        const newUser = new User({name, countryCode, telephone, 
            email: ((!req.body.email || req.body.email === "" ) ? undefined : req.body.email ), 
            password:hashedPassword});
        await newUser.save();
        res.status(200).json({"new user": newUser})
    } catch (error) {
        if (error.code === 11000){
            return res.status(400).json({
                message: "Name, Email or Phone number already used",
                success: false
            });
        }
        res.status(500).json(error);
    }
}

export const signin = async (req, res) => {
    const {countryCode, telephone, email, password} = req.body;

    console.log(req.body);

    if (!telephone && !countryCode){
        try {
            const userFound = await User.findOne({email:email.replace(/\s+/g, "")});
            if (!userFound){
                return res.status(400).json({
                    message: "Invalid email or password",
                    success: false
                });
            }
            const correctPassword  = bcryptjs.compareSync(password, userFound.password);

            if (!correctPassword){
                return res.status(400).json({
                    message: "Invalid email or password",
                    success: false
                });
            }

            const {password: pass, ...rest} = userFound._doc;

            return res.status(200).json({
                message: "User successfully connected",
                success: true,
                user: rest
            });

        } catch (error) {
            res.status(500).json({
                message: "Something wrong happened. Try Again",
                success: false,
            });
        }
    }

    else if(!email){
        try {
            const userFound = await User.findOne({
                $and:[{telephone:telephone.replace(/\s+/g, "")}, {countryCode:countryCode.replace(/\s+/g, "")}]
            });
            
            if (!userFound){
                return res.status(400).json({
                    message: "User not found. Invalid phone number or password",
                    success: false
                });
            }

            const correctPassword  = bcryptjs.compareSync(password, userFound.password);

            if (!correctPassword){
                return res.status(400).json({
                    message: "Invalid phone number or password",
                    success: false
                });
            }

            const {password: pass, ...rest} = userFound._doc;
            const token = jwt.sign({id:userFound._id}, process.env.JWT_SECRET);


            return res
            .cookie(
                "access_token",
                token,
                {
                    httpOnly:true,
                    sameSite:"strict"
                }
            )
            .status(200)
            .json({
                message: "User successfully connected",
                success: true,
                user: rest
            });

        } catch (error) {
            res.status(500).json({
                message: "Something wrong happened. Try Again",
                success: false,
            });
        }
    }
}
