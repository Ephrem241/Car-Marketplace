import { currentUser } from "@clerk/nextjs/server";

export const getSessionUser = async () => {
  try {
    const user = await currentUser();
    return user;
  } catch (error) {
    console.error("Error in getSessionUser:", error);
    return null;
  }
};
