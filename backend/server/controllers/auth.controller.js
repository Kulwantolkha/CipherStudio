import User from "../models/User.model.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const generateToken = (userId) => {
    return jwt.sign({userId},
        process.env.JWT_SECRET,
        {expiresIn: '7d'}
    )
}

export const registerUser = async (req,res) => {
    try {
        const {firstName, lastName, mobile, email, password} = req.body;

        if(!firstName || !lastName || !email || password.length < 8) {
            return res.json({success: false, message: "Fill all fields. Passowrd must be at least 8 characters."});
        }

        const userExists = await User.findOne({email});
        if(userExists) {
            return res.json({success: false, message: "User already exists."});
        }

        const hashedPassword = await bcrypt.hash(password, 5);
        const user = await User.create({firstName, lastName, mobile, email, password: hashedPassword});
        const token = generateToken(user._id.toString());

        res.json({success: true, token, message: "User registered successfully."});
        console.log("User Registered Successfully");
    }
    catch (error) {
        console.log("Register Error: ", error.message);
        res.json({success: false, message: `Unable to register user. ${error.message}`});
    }
}

export const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;

        
        if(!email || !password) {
            return res.json({success:false, message: "Email and password are required"});
        }
        const user = await User.findOne({email});
        if(!user) {
            return res.json({success: false, message: "User not found"});
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.json({success:false, message: "Invalid Credentials"});
        }

        const token = generateToken(user._id.toString());
        res.json({success: true, token, message: "Login successful"});

        console.log("User logged in successfully");
    }
    catch (error) {
        console.log("Login Error: ", error.message);
        res.json({success: false, message: `Unable to login user, ${error.message}`});
    }
}

export const getUserData = async (req,res) => {
    try {
        const {user} = req;
        res.json({success: true, user});
    }
    catch (error) {
        res.json({success: false, message: `Cannot fetch user data: ${error.message}`});
    }
}