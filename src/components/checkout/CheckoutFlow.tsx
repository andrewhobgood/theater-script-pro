import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  CreditCard, 
  MapPin, 
  FileText, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight,
  Lock,
  Shield,
  Calendar,
  Building,
  User,
  Mail,
  Phone
} from 'lucide-react';

interface CheckoutStep {
  id: string;
  title: string;
  description: string;
  icon: any;
}

interface BillingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
  saveCard: boolean;
}

interface LicenseDetails {
  organizationType: 'theater' | 'school' | 'community' | 'professional';
  performanceDates: {
    start: string;
    end: string;
  };
  venue: string;
  expectedAudience: number;
  specialRequirements: string;
  agreeToTerms: boolean;
}

export const CheckoutFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    saveCard: false
  });
  const [licenseDetails, setLicenseDetails] = useState<LicenseDetails>({
    organizationType: 'theater',
    performanceDates: { start: '', end: '' },
    venue: '',
    expectedAudience: 0,
    specialRequirements: '',
    agreeToTerms: false
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const steps: CheckoutStep[] = [
    {
      id: 'billing',
      title: 'Billing Information',
      description: 'Enter your billing details',
      icon: User
    },
    {
      id: 'license',
      title: 'License Details',
      description: 'Specify performance details',
      icon: FileText
    },
    {
      id: 'payment',
      title: 'Payment Method',
      description: 'Secure payment processing',
      icon: CreditCard
    },
    {
      id: 'review',
      title: 'Review & Confirm',
      description: 'Review your order',
      icon: CheckCircle
    }
  ];

  const mockCartTotal = 449.00;
  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return billingInfo.firstName && billingInfo.lastName && billingInfo.email && billingInfo.address;
      case 1:
        return licenseDetails.venue && licenseDetails.performanceDates.start && licenseDetails.agreeToTerms;
      case 2:
        return paymentInfo.cardNumber && paymentInfo.expiryDate && paymentInfo.cvv && paymentInfo.cardName;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    alert('Order completed successfully!');
    setIsProcessing(false);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Checkout</h1>
            <Badge variant="outline">
              Step {currentStep + 1} of {steps.length}
            </Badge>
          </div>
          
          <Progress value={progressPercentage} className="mb-4" />
          
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2 
                    ${isCompleted ? 'bg-green-500 border-green-500 text-white' :
                      isActive ? 'bg-primary border-primary text-primary-foreground' :
                      'border-muted-foreground text-muted-foreground'}
                  `}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  
                  <div className="ml-3 hidden md:block">
                    <div className={`font-medium ${isActive ? 'text-primary' : isCompleted ? 'text-green-600' : 'text-muted-foreground'}`}>
                      {step.title}
                    </div>
                    <div className="text-sm text-muted-foreground">{step.description}</div>
                  </div>
                  
                  {index < steps.length - 1 && (
                    <div className={`hidden md:block w-12 h-0.5 mx-4 ${index < currentStep ? 'bg-green-500' : 'bg-muted'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {React.createElement(steps[currentStep].icon, { className: "h-5 w-5" })}
                {steps[currentStep].title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Billing Information */}
              {currentStep === 0 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={billingInfo.firstName}
                        onChange={(e) => setBillingInfo({...billingInfo, firstName: e.target.value})}
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={billingInfo.lastName}
                        onChange={(e) => setBillingInfo({...billingInfo, lastName: e.target.value})}
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={billingInfo.email}
                      onChange={(e) => setBillingInfo({...billingInfo, email: e.target.value})}
                      placeholder="john@example.com"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={billingInfo.phone}
                        onChange={(e) => setBillingInfo({...billingInfo, phone: e.target.value})}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company/Organization</Label>
                      <Input
                        id="company"
                        value={billingInfo.company}
                        onChange={(e) => setBillingInfo({...billingInfo, company: e.target.value})}
                        placeholder="Broadway Theater Co."
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      value={billingInfo.address}
                      onChange={(e) => setBillingInfo({...billingInfo, address: e.target.value})}
                      placeholder="123 Main Street"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={billingInfo.city}
                        onChange={(e) => setBillingInfo({...billingInfo, city: e.target.value})}
                        placeholder="New York"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Select value={billingInfo.state} onValueChange={(value) => setBillingInfo({...billingInfo, state: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NY">New York</SelectItem>
                          <SelectItem value="CA">California</SelectItem>
                          <SelectItem value="TX">Texas</SelectItem>
                          <SelectItem value="FL">Florida</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input
                        id="zipCode"
                        value={billingInfo.zipCode}
                        onChange={(e) => setBillingInfo({...billingInfo, zipCode: e.target.value})}
                        placeholder="10001"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: License Details */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="organizationType">Organization Type *</Label>
                    <Select 
                      value={licenseDetails.organizationType} 
                      onValueChange={(value: any) => setLicenseDetails({...licenseDetails, organizationType: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="theater">Professional Theater</SelectItem>
                        <SelectItem value="school">Educational Institution</SelectItem>
                        <SelectItem value="community">Community Theater</SelectItem>
                        <SelectItem value="professional">Professional Production</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="venue">Venue Name *</Label>
                    <Input
                      id="venue"
                      value={licenseDetails.venue}
                      onChange={(e) => setLicenseDetails({...licenseDetails, venue: e.target.value})}
                      placeholder="Broadway Theater"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="startDate">Performance Start Date *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={licenseDetails.performanceDates.start}
                        onChange={(e) => setLicenseDetails({
                          ...licenseDetails, 
                          performanceDates: {...licenseDetails.performanceDates, start: e.target.value}
                        })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate">Performance End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={licenseDetails.performanceDates.end}
                        onChange={(e) => setLicenseDetails({
                          ...licenseDetails, 
                          performanceDates: {...licenseDetails.performanceDates, end: e.target.value}
                        })}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="expectedAudience">Expected Audience Size</Label>
                    <Input
                      id="expectedAudience"
                      type="number"
                      value={licenseDetails.expectedAudience || ''}
                      onChange={(e) => setLicenseDetails({...licenseDetails, expectedAudience: parseInt(e.target.value) || 0})}
                      placeholder="500"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="specialRequirements">Special Requirements or Notes</Label>
                    <Textarea
                      id="specialRequirements"
                      value={licenseDetails.specialRequirements}
                      onChange={(e) => setLicenseDetails({...licenseDetails, specialRequirements: e.target.value})}
                      placeholder="Any special requests or modifications..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agreeToTerms"
                      checked={licenseDetails.agreeToTerms}
                      onCheckedChange={(checked) => setLicenseDetails({...licenseDetails, agreeToTerms: !!checked})}
                    />
                    <Label htmlFor="agreeToTerms" className="text-sm">
                      I agree to the licensing terms and conditions *
                    </Label>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Method */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-muted-foreground">
                      Your payment information is encrypted and secure
                    </span>
                  </div>
                  
                  <div>
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      value={paymentInfo.cardNumber}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: formatCardNumber(e.target.value)})}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Expiry Date *</Label>
                      <Input
                        id="expiryDate"
                        value={paymentInfo.expiryDate}
                        onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                        placeholder="MM/YY"
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV *</Label>
                      <Input
                        id="cvv"
                        value={paymentInfo.cvv}
                        onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                        placeholder="123"
                        maxLength={4}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="cardName">Name on Card *</Label>
                    <Input
                      id="cardName"
                      value={paymentInfo.cardName}
                      onChange={(e) => setPaymentInfo({...paymentInfo, cardName: e.target.value})}
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="saveCard"
                      checked={paymentInfo.saveCard}
                      onCheckedChange={(checked) => setPaymentInfo({...paymentInfo, saveCard: !!checked})}
                    />
                    <Label htmlFor="saveCard" className="text-sm">
                      Save card for future purchases
                    </Label>
                  </div>
                </div>
              )}

              {/* Step 4: Review & Confirm */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3">Order Summary</h3>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span>Hamlet (Standard License)</span>
                        <span>$299.00</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Romeo & Juliet (Educational License)</span>
                        <span>$150.00</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="font-semibold">Total</span>
                        <span className="font-semibold">${mockCartTotal}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Billing Information</h3>
                    <div className="text-sm space-y-1">
                      <p>{billingInfo.firstName} {billingInfo.lastName}</p>
                      <p>{billingInfo.email}</p>
                      <p>{billingInfo.address}</p>
                      <p>{billingInfo.city}, {billingInfo.state} {billingInfo.zipCode}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">License Details</h3>
                    <div className="text-sm space-y-1">
                      <p>Organization: {licenseDetails.organizationType}</p>
                      <p>Venue: {licenseDetails.venue}</p>
                      <p>Performance Dates: {licenseDetails.performanceDates.start} to {licenseDetails.performanceDates.end}</p>
                      {licenseDetails.expectedAudience > 0 && (
                        <p>Expected Audience: {licenseDetails.expectedAudience}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-3">Payment Method</h3>
                    <div className="text-sm">
                      <p>Card ending in {paymentInfo.cardNumber.slice(-4)}</p>
                      <p>Expires {paymentInfo.expiryDate}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Subtotal</span>
                  <span className="text-sm">${mockCartTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Tax</span>
                  <span className="text-sm">$35.92</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${(mockCartTotal + 35.92).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="text-xs text-muted-foreground space-y-1">
                <div className="flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  <span>Secure checkout</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  <span>256-bit SSL encryption</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        
        {currentStep < steps.length - 1 ? (
          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="spotlight-button"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={!canProceed() || isProcessing}
            className="spotlight-button"
          >
            {isProcessing ? 'Processing...' : 'Complete Order'}
          </Button>
        )}
      </div>
    </div>
  );
};