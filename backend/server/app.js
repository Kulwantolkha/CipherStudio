import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js"
import authRouter from "./routes/auth.routes.js"
import projectRouter from "./routes/project.routes.js"
import fileRouter from "./routes/File.routes.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://cipher-studio-murex.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(cors(corsOptions));

app.use(express.json());

connectDB();

app.get("/", (req, res) => res.send("CipherStudio API is running"))
app.use("/api/auth", authRouter);
app.use("/api/projects", projectRouter);
app.use("/api/files", fileRouter);
app.listen(PORT, ()=> {
    console.log(`Serverr is running on ${PORT}`)
})