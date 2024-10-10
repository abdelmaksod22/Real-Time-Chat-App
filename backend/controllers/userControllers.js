import { generateToken } from "../config/generateToken.js";

import User from "../models/userModel.js";

import bcrypt from "bcryptjs";

export const allUsers = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password) {
      return res.staus(404).json("please enter all the fields");
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json("User already Exist");
    }

    const encryptPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: encryptPassword,
      pic,
    });
    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      password: user.password,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json("Error occured. Please try again");
  }
};

export const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Authentication error:", error);
    return res
      .status(500)
      .json({ message: "Error occurred. Please try again" });
  }
};
