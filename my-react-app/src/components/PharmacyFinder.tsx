import { useState } from 'react';
import { MapPin, Clock, Phone, Navigation, Star, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  hours: string;
  phone: string;
  services: string[];
  pmbjpPartner: boolean;
}

const mockPharmacies: Pharmacy[] = [
  {
    id: '1',
    name: 'HealthPlus Pharmacy',
    address: '123 Main Street, Lagos',
    distance: '0.5 km',
    rating: 4.8,
    hours: '8:00 AM - 10:00 PM',
    phone: '+234 123 456 7890',
    services: ['PMBJP Partner', 'Home Delivery', '24/7 Emergency'],
    pmbjpPartner: true
  },
  {
    id: '2',
    name: 'MediCare Central',
    address: '456 Victoria Island, Lagos',
    distance: '1.2 km',
    rating: 4.6,
    hours: '9:00 AM - 9:00 PM',
    phone: '+234 123 456 7891',
    services: ['PMBJP Partner', 'Prescription Consultation'],
    pmbjpPartner: true
  },
  {
    id: '3',
    name: 'Wellness Pharmacy',
    address: '789 Ikeja Road, Lagos',
    distance: '2.1 km',
    rating: 4.5,
    hours: '8:30 AM - 8:30 PM',
    phone: '+234 123 456 7892',
    services: ['Home Delivery', 'Health Screening'],
    pmbjpPartner: false
  }
];

export const PharmacyFinder = () => {
  const [searchLocation, setSearchLocation] = useState('');
  const [pharmacies] = useState<Pharmacy[]>(mockPharmacies);
  const [filteredPharmacies, setFilteredPharmacies] = useState<Pharmacy[]>(mockPharmacies);

  const handleSearch = () => {
    if (!searchLocation.trim()) {
      setFilteredPharmacies(pharmacies);
      return;
    }
    
    const filtered = pharmacies.filter(pharmacy =>
      pharmacy.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
      pharmacy.address.toLowerCase().includes(searchLocation.toLowerCase())
    );
    setFilteredPharmacies(filtered);
  };

  const getDirections = (pharmacy: Pharmacy) => {
    // In a real app, this would open maps or navigation
    alert(`Getting directions to ${pharmacy.name}`);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Find PMBJP Pharmacies</h1>
        <p className="text-muted-foreground">
          Locate participating pharmacies near you for easy prescription access
        </p>
      </div>

      {/* Search Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Enter your location or pharmacy name"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="pl-10"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">
          {filteredPharmacies.length} pharmacies found
        </h2>
        
        {filteredPharmacies.map((pharmacy) => (
          <Card key={pharmacy.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {pharmacy.name}
                    {pharmacy.pmbjpPartner && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        PMBJP Partner
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4" />
                    {pharmacy.address} • {pharmacy.distance}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{pharmacy.rating}</span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{pharmacy.hours}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{pharmacy.phone}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {pharmacy.services.map((service, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {service}
                  </Badge>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => getDirections(pharmacy)}
                  className="flex-1"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
                <Button variant="outline" className="flex-1">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};