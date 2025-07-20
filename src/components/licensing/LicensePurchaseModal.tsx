import { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { apiClient } from '@/lib/api-client';
import { Script } from '@/types/script';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { StripePaymentForm } from './StripePaymentForm';

interface LicensePurchaseModalProps {
  script: Script;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

export const LicensePurchaseModal = ({ 
  script, 
  isOpen, 
  onClose, 
  onSuccess 
}: LicensePurchaseModalProps) => {
  const [licenseType, setLicenseType] = useState<'standard' | 'premium' | 'educational'>('standard');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);
  const [step, setStep] = useState<'select' | 'payment'>('select');
  const { profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const prices = {
    standard: script.price?.standard || 0,
    premium: script.price?.premium || 0,
    educational: script.price?.educational || 0,
  };

  const features = {
    standard: [
      'Performance rights for up to 5 shows',
      'Digital script access',
      'Basic performance tracking',
      'Standard support'
    ],
    premium: [
      'Unlimited performances for 1 year',
      'Digital + print-ready scripts',
      'Marketing materials included',
      'Priority support',
      'Video recording rights'
    ],
    educational: [
      'Special pricing for schools',
      'Educational resources included',
      'Flexible performance dates',
      'Student workshop materials'
    ]
  };

  const handleContinueToPayment = async () => {
    if (!profile) {
      navigate('/auth');
      return;
    }

    if (profile.role !== 'theater_company') {
      toast({
        title: "License Purchase",
        description: "Only theater companies can purchase licenses",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingIntent(true);

    try {
      const response = await apiClient.payments.createPaymentIntent({
        script_id: script.id,
        license_type: licenseType
      });

      setClientSecret(response.client_secret);
      setPaymentIntentId(response.payment_intent_id);
      setStep('payment');
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      toast({
        title: "Error",
        description: error.message || 'Failed to initialize payment',
        variant: "destructive"
      });
    } finally {
      setIsCreatingIntent(false);
    }
  };

  const handlePaymentSuccess = () => {
    toast({
      title: "License Purchased!",
      description: "Your license has been activated. You can now download the script.",
      variant: "default"
    });
    
    if (onSuccess) {
      onSuccess();
    }
    
    onClose();
    navigate('/dashboard');
  };

  const handleBack = () => {
    setStep('select');
    setClientSecret(null);
    setPaymentIntentId(null);
  };

  const handleClose = () => {
    setStep('select');
    setClientSecret(null);
    setPaymentIntentId(null);
    setLicenseType('standard');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Purchase License - {script.title}
          </DialogTitle>
          <DialogDescription>
            {step === 'select' 
              ? 'Select the license type that best fits your needs'
              : 'Complete your payment to activate the license'
            }
          </DialogDescription>
        </DialogHeader>

        {step === 'select' ? (
          <div className="space-y-6">
            <RadioGroup value={licenseType} onValueChange={(value: any) => setLicenseType(value)}>
              <div className="space-y-4">
                {(['standard', 'premium', 'educational'] as const).map((type) => (
                  <label
                    key={type}
                    className={`relative flex cursor-pointer rounded-lg border p-4 hover:bg-muted/50 transition-colors ${
                      licenseType === type ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    <RadioGroupItem value={type} id={type} className="sr-only" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold capitalize">{type} License</h3>
                          {type === 'educational' && (
                            <Badge variant="secondary">Special Pricing</Badge>
                          )}
                        </div>
                        <p className="text-2xl font-bold">${prices[type]}</p>
                      </div>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {features[type].map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-primary flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {licenseType === type && (
                      <div className="absolute top-2 right-2">
                        <div className="h-3 w-3 rounded-full bg-primary" />
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </RadioGroup>

            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>License Type:</span>
                <span className="font-medium capitalize">{licenseType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Script:</span>
                <span className="font-medium">{script.title}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${prices[licenseType]}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleContinueToPayment}
                disabled={isCreatingIntent}
                className="flex-1"
              >
                {isCreatingIntent ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Continue to Payment'
                )}
              </Button>
            </div>
          </div>
        ) : clientSecret && paymentIntentId ? (
          <div className="space-y-6">
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{script.title}</p>
                  <p className="text-sm text-muted-foreground capitalize">{licenseType} License</p>
                </div>
                <p className="text-xl font-bold">${prices[licenseType]}</p>
              </div>
            </div>

            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <StripePaymentForm
                paymentIntentId={paymentIntentId}
                onSuccess={handlePaymentSuccess}
              />
            </Elements>

            <Button
              variant="outline"
              onClick={handleBack}
              className="w-full"
            >
              Back to License Selection
            </Button>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};