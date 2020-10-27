import React  from "react";
import Layout from "../../components/layout";
import SEO from "../../components/SEO";
import Image from '../../components/image';
import { Button, CagThemeProvider } from '@cag/cag-components';

const Post = ({ pageContext }) => {
  const post = pageContext.post;

  var textArea = document.createElement('textarea');
  textArea.innerHTML = post.content;
  const postContent = textArea.value;
  const newPostContent = String(postContent)
    .substring(3, postContent.length - 5)
    .replace(/“/g, '"')
    .replace(/”/g, '"')
    .replace(/″/g, '"');

  

  const renderContent = () => {
    const postContentArray = JSON.parse(newPostContent);
    return postContentArray.map(content => {
      return <div><ContentParse  {...content} /></div>
    })
  };

  const ContentParse = (props) => {
    switch(props.type) {
      case 'paragraph': {
        return props.children.map((child => {
          if (child.bold) {
            return <span style={{fontWeight: 'bold'}}>{child.text}</span>
          } else if (child.italic) {
            return <span style={{fontStyle: 'italic'}}>{child.text}</span>
          } else {
            return <span>{child.text}</span>
          }
        }));
      };
      case 'cag-button': {
        return (
          <span>
            <Button>{props.newTitle}</Button>
          </span>
        );
      };
      default: return <Button></Button>;
    }
  }

  return (
    <CagThemeProvider ssr={{
      isTablet: false,
      isMobile: false
    }}>
      <Layout>
        <SEO title={post.title} />
        <h1> {post.title} </h1>
        {/* <div dangerouslySetInnerHTML={{__html: post.content}} /> */}
        {renderContent()}
        <Image image={post?.featuredImage} withFallback style={{ margin: 0 }}/>
      </Layout>
    </CagThemeProvider>
  )
}

export default Post;