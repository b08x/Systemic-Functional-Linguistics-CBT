
import React from 'react';

interface CodeBlockProps {
  content: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ content }) => {
  return (
    <div className="bg-[#212934]/70 rounded-md mt-4 border border-[#5c6f7e]">
      <pre className="p-4 text-xs text-[#95aac0] overflow-x-auto">
        <code>{content}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;