import React from 'react';
import { graphql, Link } from 'gatsby';

const TagTemplate = ({ data, pageContext }: { data: any, pageContext: any }) => {
  const { tag } = pageContext;
  const { edges } = data.allMarkdownRemark;

  return (
    <div className="container mx-auto px-4 mt-8">
      <h1 className="text-4xl font-bold mb-4">Posts tagged with "{tag}"</h1>
      <ul>
        {edges.map(({ node }: { node: any }) => (
          <li key={node.id} className="mb-4">
            <Link to={node.fields.slug}>
              <h2 className="text-2xl font-bold">{node.frontmatter.title}</h2>
            </Link>
            <p className="text-gray-500">{node.frontmatter.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const pageQuery = graphql`
  query($tag: String) {
    allMarkdownRemark(
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      edges {
        node {
          id
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
          }
          fields {
            slug
          }
        }
      }
    }
  }
`;

export default TagTemplate;
