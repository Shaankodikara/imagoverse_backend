import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

import { User } from "../models/User.js";

//register
export const signup = async (req, res) => {
    const { name, email, password } = req.body;
  
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ message: "user already exists!" });
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
  
    await newUser.save();
    return res.json({ status: "ok", message: "user registered successfully!" });
  }


//login
export const signin = async (req, res) => {
    const { email, password } = req.body;
  
    //check if the user already exist
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ status: "failed", message: "user record not found" });
    }
    //validate the user password
    const isValidPassword = await bcrypt.compare(password, user?.password);
  
    if (!isValidPassword) {
      return res.json({
        status: "failed",
        message: "user password is not valid",
      });
    }
  
    const token = jwt.sign({ name: user.name }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
  
    res.cookie("token", token, { httpOnly: true, maxAge: 360000 });
    return res.json({ status: "ok", message: "login successful!" });
  }

//logout user
  export const signout = (req, res) => {
    res.clearCookie('token')
    res.json({status: "ok", message: "logout successful!"})
  }

//handle forgot password
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.json({ status: "failed", message: "user not registered" });
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "5m",
      });
  
      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_KEY,
        },
      });
  
      let mailOptions = {
        from: process.env.GMAIL_FROM_ADDRESS,
        to: email,
        subject: "Reset Your Password",
        text: `${process.env.ORIGIN}/reset-password/${token}`,
      };
  
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          return res.json({ status: "failed", message: "email sending failed!" });
        } else {
          console.log("Email sent: " + info.response);
          return res.json({ status: "ok", message: "email sent successfully!" });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }


  //handle resetting users password
  export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const id = decoded.id;
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.findByIdAndUpdate({ _id: id }, { password: hashedPassword });
      return res.json({ status: "ok", message: "password reset successfully!" });
    } catch (error) {
      return res.json({ status: "failed", message: "invalid token!" });
    }
  }

  //verify if the user logged in or not
  export const verifyUser = (req, res) => {
    return res.json({status: "ok", message: "user is authorized"})
  }