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
              tags
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
    <div className="container mx-auto px-4 mt-8">
      <h1 className="text-4xl font-bold mb-4">Ammar Lakis</h1>
      <ul>
        {posts.map(({ node }: { node: any }) => (
          <li key={node.id} className="mb-4">
            <Link to={node.fields.slug}>
              <h2 className="text-2xl font-bold">{node.frontmatter.title}</h2>
            </Link>
            <p className="text-gray-500">{node.frontmatter.date}</p>
            <div className="flex flex-wrap mt-2">
              {node.frontmatter.tags && node.frontmatter.tags.map(tag => (
                <Link to={`/tags/${tag}/`} key={tag} className="mr-2 text-blue-500">
                  <div className="bg-gray-100 rounded-md px-2 py-1">
                    #{tag}
                  </div>
                </Link>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};


export default HomePage;
