import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

const handleValidationErrors = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next();
};

export const validateMyUserRequest = [
  body("name").isString().notEmpty().withMessage("Name should be a string"),
  body("addressline1").isString().notEmpty().withMessage("AddressLine1 should be a string"),
  body("city").isString().notEmpty().withMessage("City should be a string"),
  body("state").isString().notEmpty().withMessage("State should be a string"),
  body("country").isString().notEmpty().withMessage("Country should be a string"),
  handleValidationErrors,
];