import { Heading } from "@/components/common";
import CourseUpdate from "@/components/common/course/courseUpdate";
import { getCourseBySlug } from "@/servers/controllers/course.controller";

interface IUpdateCourseProps {
  searchParams: {
    slug: string;
  };
}

const UpdateCourse: React.FunctionComponent<IUpdateCourseProps> = async ({
  searchParams
}) => {
  const course = await getCourseBySlug({ slug: searchParams.slug });
  console.log("course:", course)
  if (!course) {
    return null;
  }

  return <>
    <Heading>Cập nhật khóa học</Heading>
    <CourseUpdate />
  </>;
};

export default UpdateCourse;
