import { model, models, Schema } from "mongoose";
import { ILecture } from "@/servers/interfaces";

const LectureSchema = new Schema<ILecture>({  
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  lessons: [{
    type: Schema.Types.ObjectId,
    ref: "Lesson",
  }],
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
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
}, { timestamps: true });

LectureSchema.index({ lessons: 1 });

const LectureModel = models.Lecture || model<ILecture>("Lecture", LectureSchema); // nếu đã có model Lecture thì sử dụng, nếu không thì tạo mới


export default LectureModel;