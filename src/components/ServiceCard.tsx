
import { Check, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export interface Service {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  estimatedDays: number;
}

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onToggle: (service: Service) => void;
}

const ServiceCard = ({ service, isSelected, onToggle }: ServiceCardProps) => {
  return (
    <Card className={`transition-all duration-300 hover:shadow-lg ${isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
      <CardHeader>
        <CardTitle className="text-lg">{service.name}</CardTitle>
        <CardDescription>{service.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Price:</span>
            <span className="font-bold text-lg text-green-600">KSh {service.price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Estimated Time:</span>
            <span className="text-sm">{service.estimatedDays} days</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={() => onToggle(service)}
          className={`w-full transition-all duration-300 ${
            isSelected 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isSelected ? (
            <>
              <Check className="h-4 w-4 mr-2" />
              Selected
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ServiceCard;
