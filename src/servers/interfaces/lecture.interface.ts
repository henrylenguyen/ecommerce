import { Schema } from "mongoose";

export default interface ILecture {
  _id: string;
  title: string;
  description: string;
  url: string;
  lessons: Schema.Types.ObjectId[];
  course: Schema.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
  _destroy: boolean;
  order: number;
}

