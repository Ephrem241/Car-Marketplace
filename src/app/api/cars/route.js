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

    if (!user || !user.publicMetadata?.isAdmin) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized - Only administrators can add cars",
        }),
        { status: 401 }
      );
    }

    const formData = await request.formData();

    if (
      !formData.get("make") ||
      !formData.get("model") ||
      !formData.get("description")
    ) {
      const missingFields = [];
      if (!formData.get("make")) missingFields.push("make");
      if (!formData.get("model")) missingFields.push("model");
      if (!formData.get("description")) missingFields.push("description");

      return new Response(
        JSON.stringify({
          error: `Missing required fields: ${missingFields.join(", ")}`,
        }),
        { status: 400 }
      );
    }

    const year = Number(formData.get("year"));
    const price = Number(formData.get("price"));
    const kph = Number(formData.get("kph"));

    if (isNaN(year) || isNaN(price) || isNaN(kph)) {
      return new Response(
        JSON.stringify({
          error: "Year, price, and kph must be valid numbers",
        }),
        { status: 400 }
      );
    }

    const currentYear = new Date().getFullYear();
    if (year < 1900 || year > currentYear + 1) {
      return new Response(
        JSON.stringify({
          error: `Year must be between 1900 and ${currentYear + 1}`,
        }),
        { status: 400 }
      );
    }

    if (price <= 0) {
      return new Response(
        JSON.stringify({
          error: "Price must be greater than 0",
        }),
        { status: 400 }
      );
    }

    const features = formData.getAll("features") || [];
    const images = formData.getAll("images").map((url) => url.toString());

    if (images.length < 1) {
      return new Response(
        JSON.stringify({
          error: "You must provide at least 1 image",
        }),
        { status: 400 }
      );
    }

    const carData = {
      make: formData.get("make"),
      model: formData.get("model"),
      year,
      price,
      description: formData.get("description"),
      class: formData.get("class"),
      drive: formData.get("drive"),
      fuel_type: formData.get("fuel_type"),
      transmission: formData.get("transmission"),
      kph,
      features,
      images,
      userId: user.publicMetadata.userMongoId,
      createdAt: new Date(),
    };

    const newCar = new Car(carData);

    await newCar.save();
    return new Response(
      JSON.stringify({
        message: "Car Added Successfully",
        _id: newCar._id,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Server Error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
      }),
      { status: 500 }
    );
  }
};
