import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

const handleValidationErrors = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateMyUserRequest = [
  body("name").isString().notEmpty().withMessage("Name should be a string"),
  body("addressLine1").isString().notEmpty().withMessage("AddressLine1 should be a string"),
  body("city").isString().notEmpty().withMessage("City should be a string"),
  body("state").isString().notEmpty().withMessage("State should be a string"),
  body("country").isString().notEmpty().withMessage("Country should be a string"),
  handleValidationErrors,
];

export const validateMyRestaurantRequest = [
  body("restaurantName").notEmpty().withMessage("Restaurant name is mandatory"),
  body("city").notEmpty().withMessage("City is mandatory"),
  body("state").notEmpty().withMessage("State is mandatory"),
  body("country").notEmpty().withMessage("Country is mandatory"),
  body("deliveryPrice")
    .isFloat({ min: 0 })
    .withMessage("Price must be greater than zero"),
  body("estimatedDeliveryTime")
    .isInt({ min: 0 })
    .withMessage("Estimated delivery time must be greater than zero"),
  body("cuisines")
    .isArray()
    .withMessage("Cuisines should be an array")
    .not()
    .isEmpty()
    .withMessage("Cuisines array should not be empty"),
  body("menuItems").isArray().withMessage("Menu items must be an array"),
  body("menuItems.*.name").notEmpty().withMessage("Menu item name is mandatory"),
  body("menuItems.*.price")
    .isFloat({ min: 0 })
    .withMessage("Menu item price is mandatory and should be greater than zero"),
  handleValidationErrors,
];