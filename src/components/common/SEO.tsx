import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  schema?: Record<string, any>;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'SKS Travels — Tamil Nadu Tourist Van Rental & Group Tour Packages',
  description = 'Explore Tamil Nadu together with SKS Travels. Premium tourist van rentals (17, 18, 19, 21, 22 seater) across all 38 districts. Customised itineraries, temple pilgrimages, hill station trips, and family tours.',
  image = 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
  url = window.location.href,
  schema,
}) => {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }

    // Update OpenGraph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    const ogImg = document.querySelector('meta[property="og:image"]');
    if (ogImg) ogImg.setAttribute('content', image);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute('content', url);

    // Inject JSON-LD Schema
    const scriptId = 'json-ld-structured-data';
    let script = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const defaultSchema = {
      '@context': 'https://schema.org',
      '@type': 'TouristInformationCenter',
      name: 'SKS Travels',
      description: 'Tourist van rental and customised tour packages across all 38 districts of Tamil Nadu.',
      url: 'https://skstravels.com/',
      areaServed: {
        '@type': 'AdministrativeArea',
        name: 'Tamil Nadu, India',
      },
      makesOffer: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Tourist Van Rental (17, 18, 19, 21, 22 Passenger Capacities)',
          },
        },
      ],
    };

    script.textContent = JSON.stringify(schema || defaultSchema);
  }, [title, description, image, url, schema]);

  return null;
};
