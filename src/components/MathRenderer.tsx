import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface MathRendererProps {
  math: string;
  block?: boolean;
}

export function MathRenderer({ math, block = false }: MathRendererProps) {
  if (block) {
    return <BlockMath math={math} />;
  }

  // Split by $ to handle mixed text and math
  // Example: "Solve $x + 2 = 4$"
  const parts = math.split(/(\$.*?\$)/g);

  return (
    <span>
      {parts.map((part, index) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          const formula = part.slice(1, -1);
          return <InlineMath key={index} math={formula} />;
        }
        return <span key={index}>{part}</span>;
      })}
    </span>
  );
}
