import connect from "../../../lib/mongodb/mongoose.js";
import Car from "../../../lib/models/car.model.js";
import { getSessionUser } from "@/utils/getSessionUser.js";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const fuel = searchParams.get("fuel");
    const transmission = searchParams.get("transmission");

    await connect();

    const query = {};

    if (q) {
      query.$or = [
        { make: { $regex: q, $options: "i" } },
        { model: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ];
    }

    if (fuel) {
      query.fuel_type = fuel;
    }

    if (transmission) {
      query.transmission = transmission;
    }

    const cars = await Car.find(query).sort({ createdAt: -1 }).limit(50);

    return NextResponse.json(cars);
  } catch (error) {
    console.error("Error fetching cars:", error);
    return NextResponse.json({ error: "Error fetching cars" }, { status: 500 });
  }
}

export const POST = async (request) => {
  try {
    await connect();
    const user = await getSessionUser(request);

    if (!user?.publicMetadata?.isAdmin) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

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

    const requiredFields = ["make", "model", "year", "price"];
    for (const field of requiredFields) {
      if (!carData[field]) {
        return new Response(JSON.stringify({ error: `${field} is required` }), {
          status: 400,
        });
      }
    }

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
