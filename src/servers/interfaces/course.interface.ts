import { ECourseLevel, ECourseStatus } from "@/types/enums";
import { Document, Schema } from "mongoose";

interface ICourse extends Document {
  _id: string;
  title: string;
  description: string;
  price: number;
  sale_price: number;
  slug: string;
  thumbnail: string;
  intro_url: string;
  status: ECourseStatus;
  author: Schema.Types.ObjectId;
  level: ECourseLevel;
  views: number;
  rating: number[];
  infor: {
    requirements: string[];
    benefits: string[];
    qa: {
      question: string;
      answer: string;
    }[];
  };
  lectures: Schema.Types.ObjectId[]; 
  created_at: Date;
  updated_at: Date;
  _destroy: boolean; // đánh dấu xóa
  order: number;
  duration: number;
}

export default ICourse;
