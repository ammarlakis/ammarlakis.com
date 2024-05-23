import React from 'react';
import { graphql } from 'gatsby';

const PostPage = ({ data }: { data: any }) => {
  const post = data.markdownRemark; // Fetch the single post

  return (
    <div className="container mx-auto px-4 mt-8">
      <h1 className="text-4xl font-bold mb-4">Ammar Lakis</h1>
      <div key={post.id} className="mb-8">
        <h2 className="text-xl font-bold mb-2">{post.frontmatter.title}</h2>
        <p className="text-gray-500 mb-2">{post.frontmatter.date}</p>
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </div>
    </div>
  );
};

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
      html
    }
  }
`;

export default PostPage;
