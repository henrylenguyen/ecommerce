import { Schema } from "mongoose";
import { ELessonType } from "@/types/enums";
export default interface ILesson {
  _id: string;
  title: string;
  description: string;
  slug: string;
  lecture: Schema.Types.ObjectId;
  course: Schema.Types.ObjectId;
  type: ELessonType;
  created_at: Date;
  updated_at: Date;
  duration: number;
  order: number;
  video_url: string;
  content: string;
  _destroy: boolean;
}
