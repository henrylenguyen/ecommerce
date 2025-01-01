import { model, models, Schema } from "mongoose";
import { ILesson } from "@/servers/interfaces";
import { ELessonType } from "@/types/enums";

const LessonSchema = new Schema<ILesson>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  lecture: {
    type: Schema.Types.ObjectId,
    ref: "Lecture",
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  type: {
    type: String,
    enum: Object.values(ELessonType),
    default: ELessonType.VIDEO,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  duration: {
    type: Number,
  },
  order: {
    type: Number,
  },
  video_url: {
    type: String,
  },
  content: {
    type: String,
  },
  _destroy: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

LessonSchema.index({ duration: 1 }); // tạo index cho duration
const LessonModel = models.Lesson || model<ILesson>("Lesson", LessonSchema); // nếu đã có model Lesson thì sử dụng, nếu không thì tạo mới

export default LessonModel;
