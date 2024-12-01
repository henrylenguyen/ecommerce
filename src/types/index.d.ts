type TActiveLinkProps = {
  href: string;
  children: React.ReactNode;
}

type TSidebarItem = {
  title: string;
  url: string;
  icon: React.ReactNode;
}

type TCreateUser = {
  clerkId: string;
  username: string;
  email: string;
  name?: string;
  avatar?: string;
}
