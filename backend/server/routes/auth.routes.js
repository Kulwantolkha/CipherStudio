import express from "express"
import {registerUser, loginUser, getUserData} from "../controllers/auth.controller.js"
import {protect} from "../middlewares/auth.middleware.js"

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.get("/data", protect, getUserData);

export default authRouter;