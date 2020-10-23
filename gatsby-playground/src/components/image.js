import React from "react"
import { useStaticQuery, graphql } from "gatsby"

const Image = ({ image, withFallback = false, ...props }) => {
  const data = useStaticQuery(graphql`
    query {
      fallBackImage: file(relativePath: { eq: "gatsby-astronaut.png" }) {
        publicURL
      }
    }
  `)

  /* Fallback image */
  if (!image) {
    return withFallback ? <img src={data.fallBackImage.publicURL}
      alt={"Fallback"} {...props}/> : null
  }

  return <img src={image.sourceUrl} alt={image.altText} {...props}/>
}

export default Image;
