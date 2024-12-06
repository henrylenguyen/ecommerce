import { IUser } from "@/servers/interfaces";
import { EUserRole, EUserStatus } from "@/types/enums";
import { model, models } from "mongoose";
import { Schema } from "mongoose";

// tạo schema cho user
const UserSchema = new Schema<IUser>(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(EUserStatus), // lấy tất cả các giá trị của EUserStatus
      default: EUserStatus.ACTIVE, // mặc định là active
    },
    role: {
      type: String,
      enum: Object.values(EUserRole), // lấy tất cả các giá trị của EUserRole
      default: EUserRole.USER, // mặc định là user
    },
    courses: {
      type: [Schema.Types.ObjectId],
      ref: "Course", // liên kết khóa ngoại với course
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const UserModel = models.User || model<IUser>("User", UserSchema); // nếu đã có model User thì sử dụng, nếu không thì tạo mới

export default UserModel;

