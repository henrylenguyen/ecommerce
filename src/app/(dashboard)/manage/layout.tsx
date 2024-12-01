import { auth } from '@clerk/nextjs/server';
import * as React from 'react';
import { redirect } from 'next/navigation';


interface ILayoutManageProps {
  children: React.ReactNode;
}

const LayoutManage: React.FunctionComponent<ILayoutManageProps> = async ({
  children
}) => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  return <div>{children}</div>;
};

export default LayoutManage;
