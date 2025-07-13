import {
  BlocksRenderer,
  type BlocksContent,
} from "@strapi/blocks-react-renderer";

const MarkdownRenderer = (content: BlocksContent | any) => {
  return <BlocksRenderer content={content} />;
};

export default MarkdownRenderer;
