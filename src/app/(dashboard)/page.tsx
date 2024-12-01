import * as React from 'react';
import { ItemList } from '@/components/common';
import CardItem from '@/components/common/cardItem';
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface IHomePageProps {
}

const courses = [
  {
    link: "/course/1",
    image: "https://plus.unsplash.com/premium_photo-1732025157823-2fe37a94fcd2?q=80&w=2059&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Khóa học 1",
    views: 1200,
    rating: 4.5,
    duration: "6h",
    price: 79
  },
  {
    link: "/course/2",
    image: "https://images.unsplash.com/photo-1732704827525-4ffb9262eff6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Khóa học 2",
    views: 1200,
    rating: 4.5,
    duration: "6h",
    price: 79
  },
  {
    link: "/course/3",
    image: "https://images.unsplash.com/photo-1732704827525-4ffb9262eff6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Khóa học 3",
    views: 1200,
    rating: 4.5,
    duration: "6h",
    price: 79
  },
  {
    link: "/course/4",
    image: "https://images.unsplash.com/photo-1732704827525-4ffb9262eff6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    title: "Khóa học 4",
    views: 1200,
    rating: 4.5,
    duration: "6h",
    price: 79
  }
]
const HomePage: React.FunctionComponent<IHomePageProps> = () => {
  return <div>
    <ItemList>
      {courses.map((course, index) => (
        <CardItem key={index} {...course} />
      ))} 
    </ItemList>
  </div>;
};

export default HomePage;
