"use server"
import { ICourse } from "@/servers/interfaces";
import { CourseModel } from "@/servers/models";
import { IUpdateCourseParams, TCreateCourse } from "@/types";
import { httpStatus } from "@/types/enums";
import { createResponse, internalResponse } from "@/utils";
import { connectToDatabase } from "@/utils/mongoose";

export const createCourse = async (params: TCreateCourse): Promise<{
  statusCode: number;
  message: string;
  data: ICourse;
} | undefined> => {
  try {
    await connectToDatabase();
    const courseExist = await CourseModel.findOne({ slug: params.slug });
    if (courseExist) {
      return createResponse({
        statusCode: httpStatus.BAD_REQUEST,
        message: "Course already exists",
      })
    }
    const course = await CourseModel.create(params);
    return createResponse({
      statusCode: httpStatus.CREATED,
      message: "Course created successfully",
      data: course,
    })
  } catch (error) {
    console.error(error);
    internalResponse()
  }
}
export const getCourseBySlug = async ({ slug }: {
  slug: string
}): Promise<ICourse | null | undefined> => {
  try {
    await connectToDatabase();
    const course = await CourseModel.findOne({ slug });
    if (!course) return null;
    return course;
  } catch (error) {
    console.error(error);
    internalResponse()
  }
}
export const getAllCourses = async (): Promise<{
  statusCode: number;
  message: string;
  data: ICourse[];
} | undefined> => {
  try {
    await connectToDatabase();

    const courses = await CourseModel.aggregate([
      {
        $match: { status: "APPROVED" },
      },
      {
        $lookup: {
          from: "lectures",
          localField: "lectures",
          foreignField: "_id",
          as: "lectureDetails",
        },
      },
      {
        $lookup: {
          from: "lessons",
          localField: "lectureDetails.lessons",
          foreignField: "_id",
          as: "lessonDetails",
        },
      },
      {
        $addFields: {
          duration: { $sum: "$lessonDetails.duration" },
        },
      },
      {
        $project: {
          title: 1,
          slug: 1,
          description: 1,
          thumbnail: 1,
          intro_url: 1,
          level: 1,
          views: 1,
          rating: 1,
          duration: 1,
          price: 1,
          sale_price: 1,
          infor: 1,
          lectures: 1,
          author: 1,
        },
      },
    ]);

    return createResponse({
      statusCode: httpStatus.OK,
      message: "Get all courses successfully",
      data: courses,
    });
  } catch (error) {
    console.error(error);
    internalResponse();
  }
};

export const updateCourse = async (params: IUpdateCourseParams): Promise<{
  statusCode: number;
  message: string;
  data: ICourse[];
} | undefined> => {
  await connectToDatabase();
  const findCourse = await CourseModel.findOne({ slug: params.slug });
  if (!findCourse) {
    return createResponse({
      statusCode: httpStatus.BAD_REQUEST,
      message: "Course not found",
      data: [],
    })
  } else {
    await CourseModel.findOneAndUpdate({ slug: params.slug }, params.updateData, {
      new: true // Để trả dữ liệu mới nhất về
    })
  }
}