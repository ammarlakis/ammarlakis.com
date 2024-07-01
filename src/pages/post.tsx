import React from 'react';
import { graphql, Link } from 'gatsby';
import Title from '../components/title';

const PostPage = ({ data }: { data: any }) => {
  const post = data.markdownRemark;

  if (!post) {
    return <div>No post found</div>;
  }

  return (
    <div className="container mx-auto px-4 mt-8 mb-8">
      <Title />
      <div key={post.id} className="mb-8">
        <h2 className="text-xl font-bold mb-2">{post.frontmatter.title}</h2>
        <p className="text-gray-500 mb-2">{post.frontmatter.date}</p>
        <div
          className="prose mt-2"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </div>
      <div className="flex flex-wrap mt-2">
        {post.frontmatter.tags && post.frontmatter.tags.map((tag: string) => (
          <Link to={`/tags/${tag}/`} key={tag} className="mr-2 text-blue-500">
            <div className="bg-gray-100 rounded-md px-2 py-1">
              #{tag}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const query = graphql`
  query($slug: String) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        tags
      }
      html
    }
  }
`;

export default PostPage;
