import connect from "../../../lib/mongodb/mongoose.js";
import Car from "../../../lib/models/car.model.js";
import { getSessionUser } from "@/utils/getSessionUser.js";

export const GET = async (request) => {
  try {
    await connect();

    // Get pagination parameters from URL
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const [cars, total] = await Promise.all([
      Car.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Car.countDocuments({}),
    ]);

    return new Response(
      JSON.stringify({
        success: true,
        cars,
        pagination: {
          page,
          pages: Math.ceil(total / limit),
          total,
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching cars:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to fetch cars",
      }),
      { status: 500 }
    );
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

    // Accept both JSON and multipart/form-data
    const contentType = request.headers.get("content-type");
    let carData;

    if (contentType?.includes("application/json")) {
      carData = await request.json();
    } else if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData();
      carData = {
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
        features: formData.getAll("features"),
        images: formData.getAll("images"),
      };
    } else {
      return new Response(JSON.stringify({ error: "Invalid content type" }), {
        status: 400,
      });
    }

    // Validate required fields
    const requiredFields = ["make", "model", "year", "price"];
    for (const field of requiredFields) {
      if (!carData[field]) {
        return new Response(JSON.stringify({ error: `${field} is required` }), {
          status: 400,
        });
      }
    }

    // Validate number of images
    if (!carData.images || !Array.isArray(carData.images)) {
      return new Response(
        JSON.stringify({ error: "Images must be an array" }),
        {
          status: 400,
        }
      );
    }

    if (carData.images.length > 4) {
      return new Response(
        JSON.stringify({ error: "Maximum of 4 images allowed" }),
        { status: 400 }
      );
    }

    carData.createdBy = user.publicMetadata.userMongoId;

    const newCar = new Car(carData);
    await newCar.save();

    return new Response(
      JSON.stringify({ message: "Car Added Successfully", _id: newCar._id }),
      { status: 201 }
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
