import React from 'react'
import { graphql, useStaticQuery } from 'gatsby'

const Title: React.FC = () => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <a href="/">
      <h1 className="text-4xl font-bold mb-4">{data.site.siteMetadata.title}</h1>
    </a>
  )
}

export default Title
