import Post from "../../../../lib/models/post.model.js";
import { connect } from "../../../../lib/mongodb/mongoose.js";
import { currentUser } from "@clerk/nextjs/server";
export const POST = async (req) => {
  const user = await currentUser();
  try {
    await connect();
    const data = await req.json();

    if (
      !user ||
      user.publicMetadata.userMongoId !== data.userMongoId ||
      user.publicMetadata.isAdmin !== true
    ) {
      return new Response("Unauthorized", {
        status: 401,
      });
    }
    const slug = `${data.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "")}-${Date.now()}`;
    const newPost = await Post.create({
      userId: user.publicMetadata.userMongoId,
      make: data.make,
      model: data.model,
      year: data.year,
      mileage: data.mileage,
      transmission: data.transmission,
      price: data.price,
      features: data.features,
      images: data.images,
      category: data.category,
      slug,
    });
    await newPost.save();
    return new Response(JSON.stringify(newPost), {
      status: 201,
    });
  } catch (error) {
    console.log("Error creating post:", error);
    return new Response("Error creating post", {
      status: 500,
    });
  }
};
