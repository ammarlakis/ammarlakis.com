import React from 'react';
import { graphql } from 'gatsby';

const PostPage = ({ data }: { data: any }) => {
  const posts = data.allMarkdownRemark.edges;

  return (
    <div>
      <h1>Posts</h1>
      {posts.map(({ node }: { node: any }) => (
        <div key={node.id}>
          <h2>{node.frontmatter.title}</h2>
          <p>{node.frontmatter.date}</p>
          <div dangerouslySetInnerHTML={{ __html: node.html }} />
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
