// hooks/useServices.ts
import { useEffect, useState } from 'react';

interface ServiceStatus {
  flight: boolean;
  hotel: boolean;
  car: boolean;
}

export function useServices() {
  const [services, setServices] = useState<ServiceStatus>({
    flight: true,
    hotel: true,
    car: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/config/services');
        const data = await response.json();
        if (data.success) {
          setServices(data.services);
        }
      } catch (error) {
        console.error('Failed to fetch service status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return { services, loading };
}
