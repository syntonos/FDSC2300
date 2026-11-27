import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';
import { DocumentPreview, documentPreviewSource } from './DocumentPreview';
import { assetUrl } from '../../lib/assets';

export function Markdown({ children }: { children: string }) {
  return <div className="prose"><ReactMarkdown remarkPlugins={[remarkGfm]} components={{
    a: ({ href = '', children }) => {
      const source = documentPreviewSource(href);
      if (source) return <DocumentPreview href={href} source={source}>{children}</DocumentPreview>;
      return href.startsWith('/') && !href.startsWith('//') ? <Link to={href}>{children}</Link> : <a href={href}>{children}</a>;
    },
    img: ({ src = '', alt = '' }) => <img src={assetUrl(src)} alt={alt} loading="lazy" />,
  }}>{children}</ReactMarkdown></div>;
}
