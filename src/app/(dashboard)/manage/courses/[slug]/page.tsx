import { Button } from '@/components/ui/button';
import { getCourseBySlug } from '@/servers/controllers/course.controller';
import Image from 'next/image';
import { FunctionComponent } from 'react';

interface ICourseDetailPageProps {
  params: {
    slug: string;
  };
}

const InfoCard = ({ title, value }: { title: string; value: string | number }) => (
  <div className='bg-white p-5 rounded-lg'>
    <h4 className='text-gray-400 text-sm'>{title}</h4>
    <h3>{value}</h3>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className='mb-5'>
    <h2 className='font-bold text-xl mb-2'>{title}</h2>
    <div>{children}</div>
  </div>
);

const CourseDetailPage: FunctionComponent<ICourseDetailPageProps> = async ({ params }) => {
  const data = await getCourseBySlug({ slug: params.slug });
  if (!data) return null;

  const { title, description, infor, price, sale_price, thumbnail } = data;

  return (
    <div className='grid lg:grid-cols-[2fr,1fr] gap-10 min-h-screen'>
      <div>
        <div className='relative aspect-video mb-5'>
          <Image src={thumbnail} fill className='w-full h-full object-cover rounded-lg' alt={title} />
        </div>
        <h1 className='font-bold text-3xl mb-5 capitalize'>{title}</h1>
        <Section title='Mô tả'>{description}</Section>
        <Section title='Thông tin khóa học'>
          <div className='grid grid-cols-4 gap-5 mb-10'>
            <InfoCard title='Bài học' value='100' />
            <InfoCard title='Lượt xem' value='100' />
            <InfoCard title='Trình độ' value='Trung bình' />
            <InfoCard title='Thời lượng' value='100h' />
          </div>
        </Section>
        <Section title='Yêu cầu'>
          {infor.requirements.map((requirement, index) => (
            <div key={index}>{requirement}</div>
          ))}
        </Section>
        <Section title='Lợi ích'>
          {infor.benefits.map((benefit, index) => (
            <div key={index}>{benefit}</div>
          ))}
        </Section>
      </div>
      <div>
        <div className='bg-white rounded-lg p-5'>
          <div className='flex items-center gap-2 mb-3'>
            <strong className='text-primary'>{sale_price}đ</strong>
            <del className='text-gray-400'>{price}đ</del>
          </div>
          <Button className='w-full' variant='primary'>Mua khóa học</Button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
