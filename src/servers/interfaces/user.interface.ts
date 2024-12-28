import { EUserRole, EUserStatus } from "@/types/enums";
import { Schema, Document } from "mongoose";

interface IUser extends Document {
  _id: string
  clerkId: string;
  email: string;
  name: string;
  username: string;
  avatar: string;
  status: EUserStatus;
  role: EUserRole;
  courses: Schema.Types.ObjectId[]; // để liên kết khóa ngoại với course
  created_at: Date;
  updated_at: Date;
}

export default IUser;
