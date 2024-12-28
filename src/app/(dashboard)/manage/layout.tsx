import { auth } from '@clerk/nextjs/server';
import * as React from 'react';
import { redirect } from 'next/navigation';
import { getUserById } from '@/servers/controllers/user.controller';
import { EUserRole } from '@/types/enums';
import PageNotFound from '@/app/not-found';


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
  const user = await getUserById({ userId });
  if (user && user.role !== EUserRole.ADMIN) {
    return <PageNotFound/>
  }
  return <div>{children}</div>;
};

export default LayoutManage;
