
import { useState } from 'react';
import { Check, Smartphone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface MpesaModalProps {
  isOpen: boolean;
  total: number;
  onClose: () => void;
  onPaymentSuccess: (phoneNumber: string, transactionId: string) => void;
}

const MpesaModal = ({ isOpen, total, onClose, onPaymentSuccess }: MpesaModalProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'input' | 'processing' | 'success'>('input');

  if (!isOpen) return null;

  const handlePayment = async () => {
    if (!phoneNumber) return;
    
    setIsProcessing(true);
    setStep('processing');
    
    // Simulate M-Pesa payment process
    setTimeout(() => {
      const transactionId = `TXN${Date.now()}`;
      setStep('success');
      setTimeout(() => {
        onPaymentSuccess(phoneNumber, transactionId);
        handleClose();
      }, 2000);
    }, 3000);
  };

  const handleClose = () => {
    setPhoneNumber('');
    setStep('input');
    setIsProcessing(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-green-600" />
            M-Pesa Payment
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleClose} disabled={isProcessing}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 'input' && (
            <>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">KSh {total.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Amount to pay</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">M-Pesa Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0712345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="text-center"
                />
              </div>
              <Button
                onClick={handlePayment}
                disabled={!phoneNumber}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Send M-Pesa Prompt
              </Button>
            </>
          )}

          {step === 'processing' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <p className="font-medium">Processing payment...</p>
              <p className="text-sm text-gray-600">Check your phone for M-Pesa prompt</p>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center py-8">
              <Check className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <p className="font-medium text-green-600">Payment Successful!</p>
              <p className="text-sm text-gray-600">Your order has been placed</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MpesaModal;
