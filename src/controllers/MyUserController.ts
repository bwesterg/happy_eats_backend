import { Request, Response } from "express";
import User from "../models/user";

const createCurrentUser = async (req: Request, res: Response) => {
  //2. Create user if they dont' exist
  //3. return the user object to the calling client
  
  //1. Check if user exists
  try {
    const { auth0Id } = req.body;
    const existingUser = await User.findOne({ auth0Id });

    if (existingUser){
      return res.status(200).send();
    }

    const newUser = new User(req.body);
    await newUser.save();

    res.status(201).json(newUser.toObject());
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error creating user" })
  }
};

const updateCurrentUser = async (req: Request, res: Response) => {
  try {
    const { name, addressLine1, city, state, country } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "This user not found"});
    }

    user.name = name;
    user.addressLine1 = addressLine1;
    user.city = city;
    user.state = state;
    user.country = country;

    await user.save();

    res.send(user);
  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "updating user" });
  }
};

export default {
  createCurrentUser,
  updateCurrentUser,
};