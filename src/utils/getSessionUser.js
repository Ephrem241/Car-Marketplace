import { currentUser } from "@clerk/nextjs/server";

export const getSessionUser = async () => {
  const user = await currentUser();
  if (!user?.publicMetadata?.userMongoId) return null;
  return user;
};
