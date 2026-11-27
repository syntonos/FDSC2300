import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';
import { assetUrl } from '../../lib/assets';

export function Markdown({ children }: { children: string }) {
  return <div className="prose"><ReactMarkdown remarkPlugins={[remarkGfm]} components={{
    a: ({ href = '', children }) => href.startsWith('/') ? <Link to={href}>{children}</Link> : <a href={href}>{children}</a>,
    img: ({ src = '', alt = '' }) => <img src={assetUrl(src)} alt={alt} loading="lazy" />,
  }}>{children}</ReactMarkdown></div>;
}
