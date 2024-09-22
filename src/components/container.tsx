import React, { ReactNode } from 'react';

type ArticleContainerProps = {
  children: ReactNode;
};

const ArticleContainer: React.FC<ArticleContainerProps> = ({ children }) => {
  return (
    <div className="container px-4 mt-8 max-w-prose mx-auto p-8">
      {children}
    </div>
  );
};

export default ArticleContainer;
