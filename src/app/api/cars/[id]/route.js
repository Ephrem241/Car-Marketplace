import Car from "@/lib/models/Car";
import connect from "@/lib/mongodb/mongoose";

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
