import { createUser } from '@/servers/controllers/user.controller';
import * as React from 'react';

interface ILearningProps {
}

const Learning: React.FunctionComponent<ILearningProps> = async (props) => {
  const user = await createUser({
    clerkId: "clerk-id",
    username: "username",
    email: "email",
  });
  return <div>Learning</div>;
};

export default Learning;
