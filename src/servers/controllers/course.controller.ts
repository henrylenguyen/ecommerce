"use server"
import { ICourse } from "@/servers/interfaces";
import { CourseModel } from "@/servers/models";
import { httpStatus } from "@/types/enums";
import { createResponse } from "@/utils";
import { connectToDatabase } from "@/utils/mongoose";

export const createCourse = async (params: TCreateCourse): Promise<{
  statusCode: number;
  message: string;
  data: ICourse;
}> => {
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
    throw error;
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
    throw error;
  }
}