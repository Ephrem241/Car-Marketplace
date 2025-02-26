import connect from "../../../../../lib/mongodb/mongoose.js";
import Car from "../../../../../lib/models/car.model.js";

export const GET = async (request, { params }) => {
  try {
    await connect();

    const userId = params.userId;

    if (!userId) {
      return new Response("User ID is required", {
        status: 400,
      });
    }

    const cars = await Car.find({ createdBy: userId });

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
