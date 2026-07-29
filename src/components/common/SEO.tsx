import { Helmet } from 'react-helmet-async';
import { portfolioData } from '../../data/portfolio';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
}

export const SEO = ({ 
  title = `${portfolioData.personal.name} — Full Stack & Software Architect Portfolio`, 
  description = `${portfolioData.personal.title}. Especializado en .NET 8, Clean Architecture, CQRS, Angular, React Native, Gacad, Mi ISTPET y Software Nativo de Escritorio en Quito, Ecuador.`,
  image = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop"
}: SEOProps) => {
  return (
    <Helmet>
      {/* Etiquetas Estándar */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="Anthony Pilatasig, Anthony David Pilatasig Macas, Software Developer, Full Stack, .NET 8, Clean Architecture, CQRS, Angular, React Native, Mi ISTPET, Gacad, Quito Ecuador, Desktop Apps, Java POO, DebtManager" />
      <meta name="author" content={portfolioData.personal.name} />

      {/* OpenGraph / Facebook / LinkedIn */}
      <meta property="og:type" content="website" />
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
