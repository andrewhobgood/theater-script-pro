import { useState } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { apiClient } from '@/lib/api-client';

interface StripePaymentFormProps {
  paymentIntentId: string;
  onSuccess: () => void;
  onError?: (error: string) => void;
}

export const StripePaymentForm = ({ 
  paymentIntentId, 
  onSuccess, 
  onError 
}: StripePaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      // Confirm the payment
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (error) {
        setErrorMessage(error.message || 'Payment failed');
        if (onError) {
          onError(error.message || 'Payment failed');
        }
        toast({
          title: "Payment Failed",
          description: error.message || 'Payment could not be processed',
          variant: "destructive"
        });
      } else if (paymentIntent?.status === 'succeeded') {
        // Confirm payment on backend
        await apiClient.payments.confirmPayment(paymentIntentId);
        
        toast({
          title: "Payment Successful!",
          description: "Your license has been activated.",
          variant: "default"
        });

        onSuccess();
      }
    } catch (error: any) {
      const message = error.message || 'An unexpected error occurred';
      setErrorMessage(message);
      if (onError) {
        onError(message);
      }
      toast({
        title: "Error",
        description: message,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement 
        options={{
          layout: 'tabs',
          defaultValues: {
            billingDetails: {
              email: '',
              name: '',
            }
          }
        }}
      />
      
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || !elements || isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          'Complete Purchase'
        )}
      </Button>
    </form>
  );
};