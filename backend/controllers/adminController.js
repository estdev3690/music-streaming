import adminModel from "../models/adminModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import musicModel from "../models/musicModel.js";
import fs from "fs";

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const existingUser = await adminModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new adminModel({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie(token, {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userResponse = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    };
    res.status(200).json({
      success: true,
      message: "user registered successfully",
      user: userResponse,
      token,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error in Register" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await adminModel.findOne({ email });
    if (!user) {
      return res
        .status(409)
        .json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie(token, {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
    };
    res.status(200).json({
      success: true,
      message: "login successfull",
      user: userResponse,
      token,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server Error in Login" });
  }
};

const uploadMusic = async (req, res) => {
  try {
    const { title, artist } = req.body;
    if (!title || !artist) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const musicFile = req.files.music?.[0];
    const imageFile = req.files.image?.[0];
    if (!musicFile) {
      return res
        .status(400)
        .json({ success: false, message: "no musicfile found" });
    }
    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "no imagefile found" });
    }
    const allowedExtensions = [
      ".mp3",
      ".wav",
      ".webp",
      ".jpg",
      ".png",
      ".jpeg",
    ];
    const musicExt = path.extname(musicFile.originalname).toLowerCase();
    const imageExt = path.extname(imageFile.originalname).toLowerCase();
    if (
      !allowedExtensions.includes(musicExt) ||
      !allowedExtensions.includes(imageExt)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "invalid extension found" });
    }

    const filePath = musicFile.path;
    const imageFilePath = imageFile.path;

    const music = new musicModel({
      title,
      artist,
      filePath,
      imageFilePath,
    });
    await music.save();

    res
      .status(201)
      .json({ success: true, message: "music uploaded successfully",music });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal upload Error in Login" });
  }
};

const getMusic = async (req, res) => {
  try {
    const musics = await musicModel.find();
    if (!musics) {
      return res
        .status(401)
        .json({ success: false, message: "no songs found" });
    }

    res.json({ success: true, musics });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal upload Error in Login" });
  }
};

const deleteMusic = async (req, res) => {
  try {
    const { id } = req.params;
    const music = await musicModel.findByIdAndDelete(id);
    if (!music) {
      return res
        .status(401)
        .json({ success: false, message: "music not found to delete" });
    }
    res
      .status(200)
      .json({ success: true, message: "music deleted sucessfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal upload Error in Login" });
  }
};

export { register, login, uploadMusic, getMusic, deleteMusic };
