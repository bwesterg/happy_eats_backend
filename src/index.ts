import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import myUserRoute from './routes/MyUserRoute';
import { v2 as cloudinary } from "cloudinary";
import myRestaurantRoute from './routes/MyRestaurantRoute';
import restaurantRoute from "./routes/RestaurantRoute";
import orderRoute from "./routes/OrderRoute";

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING as string)
  .then(() => console.log("Connected to mongo database"));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const app = express();
app.use(express.json());
app.use(cors());

app.get("/health", async (req: Request, res: Response) => {
  res.send({ message: "Web App Health is GOOD"});
})

app.get("/test", async (req: Request, res: Response) => {
  res.json({ message: "hello there buddy" });
});

// /api/my/user
app.use("/api/my/user", myUserRoute);
app.use("/api/my/restaurant", myRestaurantRoute);
app.use("/api/restaurant", restaurantRoute);
// ^^^ user does NOT need to be logged in to use search
app.use("/api/order", orderRoute);

app.listen(7000, () => {
  console.log("server started on localhost:7000");
});

