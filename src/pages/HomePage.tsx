import React, { useState, useEffect } from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { TrustSection } from '../components/home/TrustSection';
import { PopularDestinations } from '../components/home/PopularDestinations';
import { FleetPreview } from '../components/home/FleetPreview';
import { PackagesPreview } from '../components/home/PackagesPreview';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { SEO } from '../components/common/SEO';
import { api } from '../services/api';
import { Vehicle, Destination, TourPackage } from '../types';

export const HomePage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [packages, setPackages] = useState<TourPackage[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [v, d, p] = await Promise.all([
          api.getVehicles(),
          api.getDestinations(),
          api.getPackages(),
        ]);
        setVehicles(v);
        setDestinations(d);
        setPackages(p);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <SEO
        title="SKS Travels — Tamil Nadu Tourist Van Rental & Group Tour Packages"
        description="Explore Tamil Nadu together with SKS Travels. Premium tourist van rentals (17, 18, 19, 21, 22 seater) across all 38 districts. Customised itineraries, temple pilgrimages, hill station trips, and family tours."
      />
      <HeroSection />
      <TrustSection />
      <PopularDestinations destinations={destinations} />
      <FleetPreview vehicles={vehicles} />
      <PackagesPreview packages={packages} />
      <WhyChooseUs />
    </div>
  );
};
