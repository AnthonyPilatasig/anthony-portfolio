import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { portfolioData } from '../../data/portfolio';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
}

// Absolute URL to the real profile photo — computed at runtime (not hardcoded to one
// domain) so it stays correct whether this deploys under GitHub Pages' /anthony-portfolio/
// sub-path or at a bare domain root. Social crawlers need a fully-qualified URL; a
// site-relative one silently fails to resolve for them.
const defaultImage = () =>
  typeof window !== 'undefined'
    ? `${window.location.origin}${portfolioData.personal.avatar}`
    : portfolioData.personal.avatar;

export const SEO = ({
  title = `${portfolioData.personal.name} — Full Stack & Software Architect Portfolio`,
  description = `${portfolioData.personal.title}. Especializado en .NET 8, Clean Architecture, CQRS, Angular, React Native, Gacad, Mi ISTPET y Software Nativo de Escritorio en Quito, Ecuador.`,
  image = defaultImage(),
}: SEOProps) => {
  // useLocation (not raw window.location) so this actually updates on client-side
  // navigation — App.tsx renders one <SEO/> outside the routed subtree, and that
  // instance never re-renders on its own when the route changes.
  const location = useLocation();
  const url = typeof window !== 'undefined'
    ? `${window.location.origin}${location.pathname}${location.search}`
    : undefined;

  return (
    <Helmet>
      {/* Etiquetas Estándar */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="Anthony Pilatasig, Anthony David Pilatasig Macas, Software Developer, Full Stack, .NET 8, Clean Architecture, CQRS, Angular, React Native, Mi ISTPET, Gacad, Quito Ecuador, Desktop Apps, Java POO, DebtManager" />
      <meta name="author" content={portfolioData.personal.name} />
      {url && <link rel="canonical" href={url} />}

      {/* OpenGraph / Facebook / LinkedIn */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={portfolioData.personal.name} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="es_EC" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};
