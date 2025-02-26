import { currentUser } from "@clerk/nextjs/server";
import connect from "../../../../lib/mongodb/mongoose.js";
import Car from "../../../../lib/models/car.model.js";

export const POST = async (req) => {
  try {
    await connect();
    const data = await req.json();
    const user = await currentUser();

    if (!user?.publicMetadata?.isAdmin) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Unauthorized",
        }),
        { status: 401 }
      );
    }

    const page = parseInt(data.page) || 1;
    const limit = parseInt(data.limit) || 9;
    const skip = (page - 1) * limit;
    const sortDirection = data.sort === "asc" ? 1 : -1;

    const [posts, totalPosts, lastMonthPosts] = await Promise.all([
      Car.find().sort({ createdAt: sortDirection }).skip(skip).limit(limit),
      Car.countDocuments(),
      Car.countDocuments({
        createdAt: {
          $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    return new Response(
      JSON.stringify({
        success: true,
        posts,
        totalPosts,
        lastMonthPosts,
        pagination: {
          page,
          pages: Math.ceil(totalPosts / limit),
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting cars:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to fetch cars",
      }),
      { status: 500 }
    );
  }
};
