const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const morgan = require("morgan");

// import cors from "cors";
// import dotenv from "dotenv";
// import express from "express";
// import morgan from "morgan";
const { connectDB } = require("./config/db");
// import orderRouter from "./routers/order";
// import cartRouter from "./routers/cart";
// import categoryRouter from "./routers/category";
const productRouter = require("./routers/product");
const categoryRouter = require("./routers/category");

// import authRouter from "./routers/auth.router";

const app = express();
// middleware
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// connect db
connectDB(process.env.DB_URI);
// routes
app.use("/api", productRouter);
// app.use("/api", authRouter);
app.use("/api", categoryRouter);
// app.use("/api", cartRouter);
// app.use("/api", orderRouter);

app.listen(8080, () => {
  console.log("server running...");
});

//export const viteNodeApp = app;
