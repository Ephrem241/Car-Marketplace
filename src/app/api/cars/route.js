import connect from "../../../lib/mongodb/mongoose.js";
import Car from "../../../lib/models/car.model.js";
import { getSessionUser } from "@/utils/getSessionUser.js";

export const GET = async (request) => {
  try {
    await connect();

    const cars = await Car.find({});

    return new Response(JSON.stringify(cars), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Something Went Wrong", {
      status: 500,
    });
  }
};

export const POST = async (request) => {
  try {
    await connect();
    const user = await getSessionUser();
    if (!user || !user.publicMetadata?.isAdmin) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const formData = await request.formData();

    const requiredFields = [
      "make",
      "model",
      "year",
      "price",
      "description",
      "class",
      "drive",
      "fuel_type",
      "transmission",
      "kph",
    ];

    for (const field of requiredFields) {
      if (!formData.get(field)) {
        return new Response(
          JSON.stringify({ error: `Missing field: ${field}` }),
          { status: 400 }
        );
      }
    }

    const features = formData.getAll("features"); // Changed from "feature"
    // const images = formData.getAll("images").filter((image) => image.size > 0);

    const carData = {
      make: formData.get("make"),
      model: formData.get("model"),
      year: Number(formData.get("year")),
      price: Number(formData.get("price")),
      description: formData.get("description"),
      class: formData.get("class"),
      drive: formData.get("drive"),
      fuel_type: formData.get("fuel_type"),
      transmission: formData.get("transmission"),
      kph: Number(formData.get("kph")),
      features,
      //images,
      userId: user.publicMetadata.userMongoId,
    };

    const newCar = new Car(carData);
    await newCar.save();

    return new Response(
      JSON.stringify({ message: "Car Added Successfully", _id: newCar._id }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
