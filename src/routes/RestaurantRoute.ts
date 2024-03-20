import express from "express";
import { param } from "express-validator";
import RestaurantController from "../controllers/RestaurantController";

const router = express.Router();

//find details for one specific restaurant
router.get("/:restaurantId", 
  param("restaurantId")
  .isString()
  .trim()
  .notEmpty()
  .withMessage("RestaurantID param must be valid string"),
  RestaurantController.getRestaurant
  );

// search all restaurants
router.get(
  "/search/:city", 
  param("city")
  .isString()
  .trim()
  .notEmpty()
  .withMessage("Input must be a valid string"),
  RestaurantController.searchRestaurant
);


export default router;