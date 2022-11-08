//basic set for controller
import  express, { Router }  from "express";
import  account  from "../models/account.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const  app  = express();

app.post("/singup", async (req, res) => {
    //Get user registration data
    const id = mongoose.Schema.Types.ObjectId();
    const { firstName, lastName, email, password } = req.body;
    //check if user exists
    const userExists = await account.findOne({ email });
    if (userExists) {
        res.status(400).json({ message: "User already exists" });
    }
    //hash password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    //create vertification code
    const verificationCode = Math.floor(Math.random() * 1000000);
    //create user
    const user = await account.create({
        _id: id,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        verificationCode,
        isVerified: false,
    });
    //return the verification code
    res.status(200).json({ verificationCode });
});

app.put("/verify", async (req, res) => {
    //get user data
    const { email, verificationCode } = req.body;
    //check if user exists
    const user = await account.findOne({ email });
    if (!user) {
        res.status(400).json({ message: "User does not exist" });
    }
    //check if verification code is correct
    if (user.verificationCode !== verificationCode) {
        res.status(400).json({ message: "Verification code is incorrect" });
    }
    //update user
    user.isVerified = true;
    await user.save();
    //return success message
    res.status(200).json({ message: "User verified" });
});

app.post("/login", async (req, res) => {
    //get user data
    const { email, password } = req.body;
    //check if user exists
    const user = await account.findOne({ email });
    if (!user) {
        res.status(400).json({ message: "User does not exist" });
    }
    //check if user is verified
    if (!user.isVerified) {
        res.status(400).json({ message: "User is not verified" });
    }
    //check if password is correct
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);
    if (!isPasswordCorrect) {
        res.status(400).json({ message: "Password is incorrect" });
    }
    //create token
    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        {
            expiresIn: "1h",
        }
    );
    //return token
    res.status(200).json({ token });
});

app.get("/getOverView", async (req, res) => {
    //get the user from the token
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await account.findOne({ email: decoded.email });
    //return the user
    res.status(200).json({ user });
});

//update user
app.put("/updateUser", async (req, res) => {
    //TODO: implement update user
});



export default app;
