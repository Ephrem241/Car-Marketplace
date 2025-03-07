import connect from "../../../../lib/mongodb/mongoose.js";
import Car from "../../../../lib/models/car.model.js";
import { currentUser } from "@clerk/nextjs/server";

export const GET = async (request, { params }) => {
  try {
    await connect();

    const car = await Car.findById(params.id);

    if (!car)
      return new Response("Car Not Found", {
        status: 404,
      });

    return new Response(JSON.stringify(car), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response("Something Went Wrong", {
      status: 500,
    });
  }
};

export const DELETE = async (request, { params }) => {
  const user = await currentUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const carId = params.id;

    await connect();
    const car = await Car.findById(carId);

    if (!car) {
      return new Response("Car not found", { status: 404 });
    }

    if (
      !user.publicMetadata.isAdmin &&
      user.publicMetadata.userMongoId !== car.createdBy.toString()
    ) {
      return new Response("Unauthorized", { status: 401 });
    }

    await Car.findByIdAndDelete(carId);
    return new Response("Car deleted", { status: 200 });
  } catch (error) {
    console.log("Error deleting car:", error);
    return new Response("Error deleting car", { status: 500 });
  }
};
