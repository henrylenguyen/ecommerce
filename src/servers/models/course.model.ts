import { ICourse } from "@/servers/interfaces";
import { ECourseLevel, ECourseStatus } from "@/types/enums";
import { model, models, Schema } from "mongoose";

// tạo schema cho user
const CourseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      default: "",
    },
    intro_url: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: Object.values(ECourseStatus),
      default: ECourseStatus.PENDING,
    },  
    level: {
      type: String,
      enum: Object.values(ECourseLevel),
      default: ECourseLevel.BEGINNER,
    },
    views: {
      type: Number,
      default: 0,
    },
    rating: {
      type: [Number],
      default: [],
    },
    infor: {
      requirements: {
        type: [String],
        default: [],
      },
      benefits: {
        type: [String],
        default: [],
      },
      qa: {
        question: {
          type: String,
          default: "",
        },
        answer: {
          type: String,
          default: "",
        },
      },
    },
    lectures: {
      type: [Schema.Types.ObjectId],
      ref: "Lecture",
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
    _destroy: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
    },

  },
  { timestamps: true }
);

const CourseModel = models.Course || model<ICourse>("Course", CourseSchema); // nếu đã có model Course thì sử dụng, nếu không thì tạo mới

export default CourseModel;

