import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { apiClient } from '@/lib/api-client';
import { Script } from '@/types/script';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface LicensePurchaseProps {
  script: Script;
  onSuccess?: () => void;
}

// Initialize Stripe (you'll need to add your publishable key to env)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

export const LicensePurchase = ({ script, onSuccess }: LicensePurchaseProps) => {
  const [licenseType, setLicenseType] = useState<'standard' | 'premium' | 'educational'>('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const { profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePurchase = async () => {
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

    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Create payment intent
      const { 
        client_secret, 
        payment_intent_id, 
        license_id, 
        amount 
      } = await apiClient.payments.createPaymentIntent({
        script_id: script.id,
        license_type: licenseType
      });

      // Initialize Stripe
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      // Redirect to Stripe Checkout or use Elements
      // For now, we'll use a simple payment confirmation flow
      const { error, paymentIntent } = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: {
            // In a real implementation, you'd collect card details using Stripe Elements
            // This is a placeholder for demonstration
            token: 'tok_visa' // Test token
          },
          billing_details: {
            name: `${profile.first_name} ${profile.last_name}`,
            email: profile.email,
          }
        }
      });

      if (error) {
        setPaymentError(error.message || 'Payment failed');
        toast({
          title: "Payment Failed",
          description: error.message || 'Payment could not be processed',
          variant: "destructive"
        });
      } else if (paymentIntent?.status === 'succeeded') {
        // Confirm payment on backend
        await apiClient.payments.confirmPayment(payment_intent_id);
        
        toast({
          title: "License Purchased!",
          description: "Your license has been activated. You can now download the script.",
          variant: "default"
        });

        if (onSuccess) {
          onSuccess();
        }
        
        // Redirect to licenses page
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Purchase error:', error);
      setPaymentError(error.message || 'Failed to process payment');
      toast({
        title: "Purchase Error",
        description: error.message || 'Failed to process payment',
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

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

  return (
    <Card className="theater-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Purchase License
        </CardTitle>
        <CardDescription>
          Select a license type for "{script.title}"
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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
                        <CheckCircle className="h-3 w-3 text-primary" />
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

        {paymentError && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm">{paymentError}</p>
          </div>
        )}

        <div className="space-y-4">
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

          <Button
            onClick={handlePurchase}
            disabled={isProcessing}
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Payment...
              </>
            ) : (
              `Purchase License for $${prices[licenseType]}`
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Your payment is secure and encrypted. By purchasing, you agree to our license terms.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};