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
    console.error(error);
    return new Response(JSON.stringify({ error: "Something went wrong" }), {
      status: 500,
    });
  }
};

export const POST = async (request) => {
  try {
    await connect();
    const user = await getSessionUser(request);

    if (!user?.publicMetadata?.isAdmin) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // Check content type
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("multipart/form-data")) {
      return new Response(
        JSON.stringify({ error: "Content type must be multipart/form-data" }),
        { status: 400 }
      );
    }

    const formData = await request.formData();

    // Get all features and images as arrays
    const features = formData.getAll("features");
    const images = formData.getAll("images");

    // Validate required fields
    const requiredFields = ["make", "model", "year", "price"];
    for (const field of requiredFields) {
      if (!formData.get(field)) {
        return new Response(JSON.stringify({ error: `${field} is required` }), {
          status: 400,
        });
      }
    }

    // Create car data object
    const carData = {
      make: formData.get("make"),
      model: formData.get("model"),
      year: Number(formData.get("year")),
      price: Number(formData.get("price")),
      description: formData.get("description"),
      carClass: formData.get("carClass"),
      drive: formData.get("drive"),
      fuel_type: formData.get("fuel_type"),
      transmission: formData.get("transmission"),
      kph: Number(formData.get("kph")),
      features: features,
      images: images,
      createdBy: user.publicMetadata.userMongoId,
    };

    const newCar = new Car(carData);
    await newCar.save();

    return new Response(
      JSON.stringify({ message: "Car Added Successfully", _id: newCar._id }),
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("Error adding car:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "Failed to add car",
      }),
      { status: 500 }
    );
  }
};
