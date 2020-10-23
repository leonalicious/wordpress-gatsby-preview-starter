import React  from "react";
import Layout from "../../components/layout";
import SEO from "../../components/SEO";
import Image from '../../components/image';

const Post = ({ pageContext }) => {
  const post = pageContext.post;

  return (
    <Layout>
      <SEO title={post.title} />
      <h1> {post.title} </h1>
      <div dangerouslySetInnerHTML={{__html: post.content}} />
      <Image image={post?.featuredImage} withFallback style={{ margin: 0 }}/>
    </Layout>
  )
}

export default Post;