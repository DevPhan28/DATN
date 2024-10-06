import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import { connectDB } from "./config/db";
import orderRouter from "./routers/order";
import cartRouter from "./routers/cart";
import categoryRouter from "./routers/category";
const app = express();
// middleware
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// connect db
connectDB(process.env.DB_URI);
// routes
// app.use("/api", productRouter);
// app.use("/api", authRouter);
app.use("/api", categoryRouter);
app.use("/api", cartRouter);
app.use("/api", orderRouter);


export const viteNodeApp = app;
