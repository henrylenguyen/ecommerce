import { SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';

const AuthLayout: React.FunctionComponent = async () => {
  const { userId } = await auth();

  return <>
    {userId ? <UserButton /> : <div className='flex gap-2 items-center'>
      <SignInButton />
      <div>/</div>
      <SignUpButton />
    </div>}
  </>;
};

export default AuthLayout;
