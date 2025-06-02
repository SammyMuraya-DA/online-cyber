
import { X, ShoppingCart, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Service } from './ServiceCard';

interface CartProps {
  services: Service[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (serviceId: string) => void;
  onCheckout: () => void;
}

const Cart = ({ services, isOpen, onClose, onRemove, onCheckout }: CartProps) => {
  const total = services.reduce((sum, service) => sum + service.price, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Your Cart ({services.length})
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 overflow-y-auto">
          {services.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Your cart is empty</p>
          ) : (
            <>
              {services.map((service) => (
                <div key={service.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{service.name}</h4>
                    <p className="text-sm text-gray-600">{service.category}</p>
                    <p className="text-green-600 font-bold">KSh {service.price.toLocaleString()}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemove(service.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-green-600">KSh {total.toLocaleString()}</span>
                </div>
              </div>
              <Button
                onClick={onCheckout}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={services.length === 0}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Pay with M-Pesa
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Cart;
