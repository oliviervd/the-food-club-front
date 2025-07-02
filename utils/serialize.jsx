import escapeHTML from 'escape-html';
import { Fragment } from 'react';

const serialize = (content) => {
  if (!content) return null;
  
  if (content.root) {
    return content.root.children.map((node, i) => serializeNode(node, i));
  }
  
  if (Array.isArray(content)) {
    return content.map((node, i) => serializeNode(node, i));
  }
  
  return null;
};

const serializeNode = (node, i) => {
  if (!node) return null;

  if (node.type === 'text') {
    let text = node.text;
    
    if (!text) {
      return <br key={i} />;
    }

    let formattedText = <Fragment key={i}>{text}</Fragment>;
    
    if (node.format) {
      if (node.format & 1) {
        formattedText = <strong key={i}>{formattedText}</strong>;
      }
      if (node.format & 2) {
        formattedText = <em key={i}>{formattedText}</em>;
      }
      if (node.format & 4) {
        formattedText = <s key={i}>{formattedText}</s>;
      }
      if (node.format & 8) {
        formattedText = <u key={i}>{formattedText}</u>;
      }
      if (node.format & 16) {
        formattedText = <code key={i}>{formattedText}</code>;
      }
    }
    
    return formattedText;
  }

  switch (node.type) {
    case 'paragraph':
      return <div className="text-block" key={i}>{serialize(node.children)}</div>;
    case 'heading':
      return <div className={`heading heading-${node.tag}`} key={i}>{serialize(node.children)}</div>;
    case 'list':
      const ListTag = node.listType === 'number' ? 'ol' : 'ul';
      return <ListTag key={i}>{serialize(node.children)}</ListTag>;
    case 'listitem':
      return <li key={i}>{serialize(node.children)}</li>;
    case 'quote':
      return <blockquote key={i}>{serialize(node.children)}</blockquote>;
    case 'link':
      return (
        <a href={escapeHTML(node.url)} key={i}>
          {serialize(node.children)}
        </a>
      );
    default:
      if (node.children) {
        return serialize(node.children);
      }
      return null;
  }
};

export default serialize;