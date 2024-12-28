"use server"
import { IUser } from "@/servers/interfaces";
import { UserModel } from "@/servers/models";
import { connectToDatabase } from "@/utils/mongoose";

const createUser = async (params: TCreateUser) => {
  try {
    await connectToDatabase();
    const user = await UserModel.create(params);
    return user;
  } catch (error) {
    throw error;
  }
}
const getUserById = async ({ userId }: {
  userId: string
}): Promise<IUser | null | undefined> => {
  try {
    await connectToDatabase();
    const user = await UserModel.findOne({
      clerkId: userId
    })
    if (!user) return null;
    return user;
  } catch (error) {
    throw error;
  }
}
export { createUser, getUserById };

