import { connectToDatabase } from "@/utils/mongoose"
import { UserModel } from "@/servers/models"

const createUser = async (params: TCreateUser) => {
  try {
    await connectToDatabase();
    const user = await UserModel.create(params);
    return user;
  } catch (error) {
    throw error;
}
}
export { createUser };
