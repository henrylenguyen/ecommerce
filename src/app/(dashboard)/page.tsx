import * as React from 'react';
import { ItemList } from '@/components/common';
import CardItem from '@/components/common/cardItem';
import { getAllCourses } from '@/servers/controllers/course.controller';
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface IHomePageProps {
}
const HomePage: React.FunctionComponent<IHomePageProps> = async () => {
  const courses = await getAllCourses().then((res) => res?.data);
  return <div>
    <ItemList>
      {courses?.map((course, index) => (
        <CardItem key={index} {...course} />
      ))} 
    </ItemList>
  </div>;
};

export default HomePage;
