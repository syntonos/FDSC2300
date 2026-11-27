import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { content } from '../lib/siteContent';
import { formatDate, sortedDishes } from '../lib/content';
import { assetUrl } from '../lib/assets';
import { usePageMeta } from '../hooks/usePageMeta';
import { useMenu } from '../components/layout/SiteLayout';
import { MenuButton } from '../components/ui/MenuButton';
import { Markdown } from '../components/ui/Markdown';
import { FoodImage } from '../components/ui/FoodImage';
import { SkillLine } from '../components/ui/SkillLine';
import { DishCard } from '../components/dishes/DishCard';

export function HomePage() {
  const home = content.pages.home;
  const { open, openMenu } = useMenu();
  const featured = sortedDishes(content.dishes, 'past').slice(0, 3);
  const next = sortedDishes(content.dishes, 'upcoming')[0];
  const words = home.dividerWords || ['Observe', 'Experiment', 'Taste', 'Repeat'];
  usePageMeta(home.title, home.description);
  return <>
    <section className="hero hero-cover" aria-labelledby="hero-heading">
      <MenuButton cover open={open} onOpen={openMenu} />
      <div className="hero-color" />
      <div className="hero-photo"><img src={assetUrl(home.heroImage!)} alt="A handmade citrus tart with fresh fruit and herbs" fetchPriority="high" width={1600} height={1800} data-parallax /></div>
      <div className="hero-topline"><span>{home.heroEyebrow || content.settings.course}</span><span>{content.settings.institution.toUpperCase()}</span></div>
      <div className="hero-content"><h1 id="hero-heading" className="hero-title"><span>{home.heroFirst || 'Culinary'}</span><b>+</b><span>{home.heroSecond || 'Science'}</span></h1></div>
      <div className="hero-content hero-content-inverse" aria-hidden="true"><div className="hero-title"><span>{home.heroFirst || 'Culinary'}</span><b>+</b><span>{home.heroSecond || 'Science'}</span></div></div>
      <div className="hero-bottom"><a href="#about" className="scroll-cue" onClick={event => { event.preventDefault(); document.getElementById('about')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); }}><span className="scroll-cue-label">{home.scrollLabel || 'Scroll down'}</span><span className="scroll-cue-arrow" aria-hidden="true">↓</span></a></div>
    </section>
    <div className="cover-divider">{words.map((word, index) => <Fragment key={word}><span>{word}</span>{index < words.length - 1 && <i aria-hidden="true">·</i>}</Fragment>)}</div>
    <section id="about" className="about-section section-pad" data-about-parallax>
      <div className="about-art" data-about-collage>
        <div className="green-block green-back" data-parallax-layer data-layer-speed="0.24" data-layer-limit="90" data-layer-limit-mobile="62" />
        <div className="green-block green-front" data-parallax-layer data-layer-speed="-0.16" data-layer-limit="65" data-layer-limit-mobile="46" />
        <div className="about-photo" data-parallax-layer data-layer-speed="0.07" data-layer-limit="34" data-layer-limit-mobile="24"><img src={assetUrl(home.aboutImage!)} alt={home.aboutImageAlt || 'Seasonal ingredients'} loading="lazy" width={900} height={1100} /></div>
      </div>
      <div className="about-copy"><h2>{home.introTitle || 'About the class.'}</h2><Markdown>{home.body}</Markdown><Link className="text-link" to="/mise-en-place/">Class resources <span>↗</span></Link></div>
    </section>
    <section className="featured-section section-pad"><div className="section-heading"><h2>{home.featuredTitle || 'Past dishes.'}</h2><Link to="/past-dishes/" className="text-link">View all <span>↗</span></Link></div><div className="dish-grid featured-grid" data-dish-parallax>{featured.map(dish => <DishCard key={dish.id} dish={dish} />)}</div></section>
    {next && <section className="next-section"><div className="next-photo"><FoodImage image={next.image} alt={next.imageAlt} inset={next.imageInset} /></div><div className="next-copy"><h2>{home.nextTitle || 'Next up.'}</h2><span className="next-date">{formatDate(next.date)}</span><h3>{next.title}</h3><SkillLine skills={next.skills} technique={next.technique} /><Link className="text-link" to="/menu/">View menu <span>↗</span></Link></div></section>}
  </>;
}
