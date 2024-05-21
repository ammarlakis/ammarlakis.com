import React from 'react';
import { Link, graphql, useStaticQuery } from 'gatsby';

const HomePage = () => {
  const data = useStaticQuery(graphql`
    query {
      allMarkdownRemark {
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
  `);

  const posts = data.allMarkdownRemark.edges;

  return (
    <div>
      <h1>My Blog</h1>
      <ul>
        {posts.map(({ node }: { node: any }) => (
          <li key={node.id}>
            <Link to={node.fields.slug}>
              <h2>{node.frontmatter.title}</h2>
            </Link>
            <p>{node.frontmatter.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
