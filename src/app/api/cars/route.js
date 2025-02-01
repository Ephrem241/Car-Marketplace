import { currentUser } from "@clerk/nextjs/server";
import connect from "../../../lib/mongodb/mongoose.js";
import Car from "../../../lib/models/car.model.js";
import Post from "../../../lib/models/post.model.js";

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
  const user = await currentUser();
  try {
    await connect();

    const formData = await request.formData();

    if (
      !user ||
      user.publicMetadata.userMongoId !== data.userMongoId ||
      user.publicMetadata.isAdmin !== true
    ) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }

    const feature = formData.getAll("feature");
    const images = formData
      .getAll("images")
      .filter((image) => image.name !== "");

    const carData = await Post.create({
      make: formData.get("make"),
      model: formData.get("model"),
      year: formData.get("year"),
      price: formData.get("price"),
      description: formData.get("description"),
      class: formData.get("class"),
      drive: formData.get("drive"),
      fuel_type: formData.get("fuel_type"),
      transmission: formData.get("transmission"),
      kph: formData.get("kph"),
      feature,
      images,
      seller_info: {
        name: formData.get("seller_info.name"),
        email: formData.get("seller_info.email"),
        phone: formData.get("seller_info.phone"),
      },
      userId: user.publicMetadata.userMongoId,
    });

    await carData.save();
    return new Response("Car Added Successfully", {
      status: 200,
    });
  } catch (error) {
    return new Response("Failed to add car", {
      status: 500,
    });
  }
};
