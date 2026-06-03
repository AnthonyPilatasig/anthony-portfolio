import { Helmet } from 'react-helmet-async';
import { portfolioData } from '../../data/portfolio';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
}

export const SEO = ({ 
  title = `${portfolioData.personal.name} | Portafolio`, 
  description = portfolioData.personal.title,
  image = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop" // Imagen genérica de código
}: SEOProps) => {
  return (
    <Helmet>
      {/* Etiquetas Estándar */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* OpenGraph / Facebook / LinkedIn */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};
