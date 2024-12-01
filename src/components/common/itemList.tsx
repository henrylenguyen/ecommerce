import * as React from 'react';

interface IItemListProps {
  children: React.ReactNode;
}

const ItemList: React.FunctionComponent<IItemListProps> = ({ children }) => {
  return <div className="item-list grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">{children}</div>;
};

export default ItemList;
