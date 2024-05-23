import React from 'react';
import { graphql } from 'gatsby';

const PostPage = ({ data }: { data: any }) => {
  const posts = data.allMarkdownRemark.edges;

  return (
    <div className="container mx-auto px-4 mt-8">
      <h1 className="text-4xl font-bold mb-4" >Ammar Lakis</h1>
      {posts.map(({ node }: { node: any }) => (
        <div key={node.id} className="mb-8">
          <h2 className="text-xl font-bold mb-2">{node.frontmatter.title}</h2>
          <p className="text-gray-500 mb-2">{node.frontmatter.date}</p>
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: node.html }}
          />
        </div>
      ))}
    </div>
  );
};


export const query = graphql`
  query {
    allMarkdownRemark {
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
          }
          html
        }
      }
    }
  }
`;


export default PostPage;
