import { content } from '../lib/siteContent';
import { usePageMeta } from '../hooks/usePageMeta';
import { Markdown } from '../components/ui/Markdown';
export function NotFoundPage() {
  const page = content.pages['404'];
  usePageMeta(page.title, page.description);
  return <section className="not-found section-pad"><h1>{page.title}<i>.</i></h1><Markdown>{page.body}</Markdown></section>;
}
