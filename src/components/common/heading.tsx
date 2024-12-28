
interface IHeadingProps {
  children: React.ReactNode;
}

const Heading: React.FunctionComponent<IHeadingProps> = ({ children }) => {
  return <h1 className='font-bold text-2xl lg:text-3xl capitalize'>
    {children}
  </h1>;
};

export default Heading;
