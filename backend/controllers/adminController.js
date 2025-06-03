import adminModel from "../models/adminModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import musicModel from "../models/musicModel.js";
import fs from "fs";
import { uploadToGridFS, deleteFile } from "../utils/gridfs.js";
import mongoose from "mongoose";

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

    const musicFile = req.files?.music?.[0];
    const imageFile = req.files?.image?.[0];

    if (!musicFile) {
      return res
        .status(400)
        .json({ success: false, message: "No music file found" });
    }
    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "No image file found" });
    }

    // Upload files to GridFS
    const musicFileName = `${Date.now()}_${musicFile.originalname.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`;
    const imageFileName = `${Date.now()}_${imageFile.originalname.replace(/[^a-z0-9]/gi, '_').toLowerCase()}`;

    try {
      const [musicFileId, imageFileId] = await Promise.all([
        uploadToGridFS(musicFile, musicFileName),
        uploadToGridFS(imageFile, imageFileName)
      ]);

      const music = new musicModel({
        title,
        artist,
        musicFileId,
        imageFileId
      });
      
      await music.save();

      res.status(201).json({ 
        success: true, 
        message: "Music uploaded successfully",
        music: {
          ...music.toObject(),
          musicUrl: `/upload/${musicFileId}`,
          imageUrl: `/upload/${imageFileId}`
        }
      });
    } catch (uploadError) {
      console.error('Error uploading files:', uploadError);
      return res.status(400).json({ 
        success: false, 
        message: "Error uploading files",
        error: uploadError.message 
      });
    }
  } catch (error) {
    console.error('Error in upload music:', error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error: error.message });
  }
};

const getMusic = async (req, res) => {
  try {
    const musics = await musicModel.find();
    if (!musics?.length) {
      return res
        .status(200)
        .json({ success: true, musics: [] });
    }

    const musicList = musics.map(music => ({
      ...music.toObject(),
      musicUrl: `/upload/${music.musicFileId}`,
      imageUrl: `/upload/${music.imageFileId}`
    }));

    res.json({ success: true, musics: musicList });
  } catch (error) {
    console.error('Error in get music:', error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error: error.message });
  }
};

const deleteMusic = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid music ID format" 
      });
    }

    const music = await musicModel.findById(id);
    if (!music) {
      return res
        .status(404)
        .json({ success: false, message: "Music not found" });
    }

    try {
      // Delete files from GridFS
      await Promise.all([
        deleteFile(music.musicFileId),
        deleteFile(music.imageFileId)
      ]);

      // Delete the music document
      await musicModel.findByIdAndDelete(id);

      res.status(200).json({ 
        success: true, 
        message: "Music deleted successfully" 
      });
    } catch (deleteError) {
      console.error('Error deleting files:', deleteError);
      return res.status(500).json({ 
        success: false, 
        message: "Error deleting files",
        error: deleteError.message 
      });
    }
  } catch (error) {
    console.error('Error in delete music:', error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error", error: error.message });
  }
};

export { register, login, uploadMusic, getMusic, deleteMusic };
