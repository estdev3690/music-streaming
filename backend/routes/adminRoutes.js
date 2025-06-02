import express from "express";
import {
  deleteMusic,
  getMusic,
  login,
  register,
  uploadMusic,
} from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";

const adminRouter = express.Router();

adminRouter.post("/register", register);
adminRouter.post("/login", login);
adminRouter.post(
  "/add-music",
  upload.fields([
    { name: "music", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  uploadMusic
);
adminRouter.get("/get-music", getMusic);
adminRouter.delete("/delete-music/:id", deleteMusic);
export default adminRouter;
