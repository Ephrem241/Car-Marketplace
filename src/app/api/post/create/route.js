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

    const formData = await req.formData();

    const features = formData.getAll("features");

    const fuelType = formData.getAll("fuel_type");
    const transmissionType = formData.getAll("transmission");

    const slug = data.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");
    const newPost = await Post.create({
      userId: user.publicMetadata.userMongoId,
      make: formData.get("make"),
      model: formData.get("model"),
      price: formData.get("price"),
      mileage: formData.get("mileage"),
      year: formData.get("year"),
      features,
      fuelType,
      transmissionType,

      slug,
    });

    await newPost.save();
    return new Response(JSON.stringify(newPost), {
      status: 200,
    });
  } catch (error) {
    console.log("Error creating post:", error);
    return new Response("Error creating post", {
      status: 500,
    });
  }
};
