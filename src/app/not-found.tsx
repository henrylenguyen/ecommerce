import { notFound } from '@/assets/images';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';


const PageNotFound: React.FC = () => {
  return <div className="flex flex-col gap-4 items-center justify-center h-screen">
    <Image src={notFound} alt="not-found" width={600} height={600} />
      <h1 className="text-2xl font-bold">Không tìm thấy trang</h1>
      <p className="text-sm text-gray-500">Trang bạn đang tìm kiếm không tồn tại.</p>
      <Link href="/">
        <Button>Về trang chủ</Button>
      </Link>
    </div>
  ;
};

export default PageNotFound;
