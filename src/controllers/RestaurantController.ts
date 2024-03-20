import { Request, Response } from "express";
import Restaurant from "../models/restaurant";

const getRestaurant = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.params.restaurantId

    const restaurant = await Restaurant.findById(restaurantId);
    if(!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" })
    }

    res.json(restaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "something went bad" })
  }
}

const searchRestaurant = async (req: Request, res: Response) => {
  try {
    const city = req.params.city;
    const searchQuery = (req.query.searchQuery as string) || "";
    const selectedCuisines = req.query.selectedCuisines as string || "";
    const sortOption = req.query.sortOption as string || "lastUpdated";
    const page = parseInt(req.query.page as string) || 1;

    let query: any = {};
    query["city"] = new RegExp(city, "i");
    const cityCheck = await Restaurant.countDocuments(query)
    if (cityCheck === 0){
      return res.status(404).json({
        data: [],
        // front end will be expecting an empty array ^^^
        pagination: {
          total: 0,
          page: 1,
          pages: 1,
        },
      });
    };

    // example, URL = selectedCuisines=italian,burgers,chinese
    if (selectedCuisines){
      const cuisinesArray = selectedCuisines
        .split(",")
        .map((cuisine)=> new RegExp(cuisine, "i"));

        query["cuisines"] = { $all: cuisinesArray };
    };
    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");
      query["$or"] = [
        { restaurantName: searchRegex },
        // ^^^either the restaurantName field matches the 
        //    searchRegex pattern, or...
        { cuisines: {$in: [searchRegex]} },
        // ^^^...the cuisines field contains at least 
        //    one element matching the searchRegex pattern
      ];
    }

    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const restaurants = await Restaurant.find(query)
    // ^^^ e.g, if sortOption is lastUpdated, it will sort by the key 
    //    of lastUpdated (in restaurant.ts), and because this is
    //    dynamic, we need to use the array syntax.
      .sort({ [sortOption]: 1 }).skip(skip).limit(pageSize).lean();
      // ^^^ .lean() strips out Mongoose ids and metadata and
      //   returns a plain JS object.

    const total = await Restaurant.countDocuments(query);
    const response = {
      data: restaurants,
      pagination: {
        total,
        page,
        pages: Math.ceil(total/pageSize),
        // ^^^ if 50 results, pageSize = 10,
        //     then pages will be 5
      },
    };

    res.json(response);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong with restaurant search" })
  }
};

export default { searchRestaurant, getRestaurant };