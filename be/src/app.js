const cors = require("cors");
const dotenv = require("dotenv");
require("./config/orderScheduler");
const express = require("express");
const morgan = require("morgan");

const { connectDB } = require("./config/db");
const cartRouter = require("./routers/cart");
const productRouter = require("./routers/product");
const categoryRouter = require("./routers/category");
const authRouter = require("./routers/auth.router");
const orderRouter = require("./routers/order");
const shippingRoutes = require("./routers/shipping");
const couponRoutes = require("./routers/coupon");
const commentRouter = require("./routers/comment");
const paymentRoutes = require("./routers/paymentRoutes");

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
app.use("/api", authRouter);
app.use("/api", categoryRouter);
app.use("/api", cartRouter);
app.use("/api", orderRouter);
app.use("/api", shippingRoutes);
app.use("/api", couponRoutes);
app.use("/api", commentRouter);
app.use("/api", paymentRoutes);
app.listen(8080, () => {
  console.log("server running...");
});

//export const viteNodeApp = app;
