import React, { ReactNode } from 'react';

type ContainerProps = {
  children: ReactNode;
};

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="container mx-auto px-4 mt-8 max-w-prose p-8">
      {children}
    </div>
  );
};

export default Container;
