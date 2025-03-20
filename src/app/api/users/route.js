import { currentUser } from "@clerk/nextjs/server";
import connect from "../../../lib/mongodb/mongoose.js";
import User from "../../../lib/models/user.model.js";

export async function POST(req) {
  try {
    await connect();
    const data = await req.json();
    const user = await currentUser();

    console.log("API Request received:", {
      isAdmin: user?.publicMetadata?.isAdmin,
      userId: user?.id,
      page: data.page,
      limit: data.limit,
      sort: data.sort,
    });

    if (!user?.publicMetadata?.isAdmin) {
      console.log("Unauthorized access attempt");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Unauthorized - Admin access required",
        }),
        { status: 401 }
      );
    }

    const page = parseInt(data.page) || 1;
    const limit = parseInt(data.limit) || 10;
    const skip = (page - 1) * limit;
    const sortDirection = data.sort === "asc" ? 1 : -1;

    console.log("Fetching users with params:", {
      page,
      limit,
      skip,
      sortDirection,
    });

    // First, check if there are any users in the database
    const totalUsers = await User.countDocuments();
    console.log("Total users in database:", totalUsers);

    if (totalUsers === 0) {
      console.log("No users found in database");
      return new Response(
        JSON.stringify({
          success: true,
          users: [],
          totalUsers: 0,
          lastMonthUsers: 0,
          pagination: {
            page: 1,
            pages: 1,
          },
        }),
        { status: 200 }
      );
    }

    const [users, lastMonthUsers] = await Promise.all([
      User.find()
        .sort({ createdAt: sortDirection })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments({
        createdAt: {
          $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);

    console.log("Users fetched successfully:", {
      count: users.length,
      total: totalUsers,
      lastMonth: lastMonthUsers,
      firstUser: users[0]
        ? {
            id: users[0]._id,
            email: users[0].email,
            isAdmin: users[0].isAdmin,
          }
        : null,
    });

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
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      }),
      { status: 500 }
    );
  }
}
