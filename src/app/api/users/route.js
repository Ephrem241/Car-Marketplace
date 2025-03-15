import { currentUser } from "@clerk/nextjs/server";
import connect from "../../../lib/mongodb/mongoose.js";
import User from "../../../lib/models/user.model.js";

export async function POST(req) {
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
    const limit = parseInt(data.limit) || 10;
    const skip = (page - 1) * limit;
    const sortDirection = data.sort === "asc" ? 1 : -1;

    const [users, totalUsers, lastMonthUsers] = await Promise.all([
      User.find()
        .sort({ createdAt: sortDirection })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(),
      User.countDocuments({
        createdAt: {
          $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    return new Response(
      JSON.stringify({
        success: true,
        users,
        totalUsers,
        lastMonthUsers,
        pagination: {
          page,
          pages: Math.ceil(totalUsers / limit),
        },
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting users:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to fetch users",
      }),
      { status: 500 }
    );
  }
}
