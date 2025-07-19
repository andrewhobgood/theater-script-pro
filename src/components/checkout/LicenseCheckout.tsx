import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  CreditCard, 
  Lock, 
  FileText, 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign,
  Check,
  ChevronRight,
  ChevronLeft,
  Shield,
  Clock,
  AlertCircle,
  Info
} from "lucide-react";

interface LicenseCheckoutProps {
  script: {
    id: string;
    title: string;
    playwright: string;
    price: number;
  };
  licenseType: string;
  onClose: () => void;
  onComplete: (checkoutData: any) => void;
}

export const LicenseCheckout = ({ script, licenseType, onClose, onComplete }: LicenseCheckoutProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  
  const [formData, setFormData] = useState({
    // License Details
    licenseType: licenseType,
    performanceDates: {
      start: "",
      end: "",
      performances: [] as string[],
      matinee: false,
      evening: false
    },
    venue: {
      name: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      capacity: 0,
      type: "theater", // theater, school, community
      website: ""
    },
    
    // Production Info
    productionTitle: "",
    director: "",
    producer: "",
    contactPerson: "",
    email: "",
    phone: "",
    ticketPrices: {
      adult: 0,
      student: 0,
      senior: 0,
      child: 0
    },
    estimatedAttendance: 0,
    
    // Payment
    paymentMethod: "card",
    cardInfo: {
      number: "",
      expiry: "",
      cvv: "",
      name: "",
      billingAddress: {
        street: "",
        city: "",
        state: "",
        zipCode: ""
      }
    },
    promoCode: "",
    
    // Agreement & Additional
    acceptTerms: false,
    acceptRoyalties: false,
    marketingConsent: false,
    additionalRequests: "",
    rushDelivery: false
  });

  const steps = [
    { title: "License Details", description: "Performance dates and venue" },
    { title: "Production Info", description: "Show details and team" },
    { title: "Payment", description: "Billing and payment method" },
    { title: "Agreement", description: "Terms and conditions" },
    { title: "Confirmation", description: "Review and submit" }
  ];

  const licenseOptions = {
    perusal: { name: "Perusal License", price: 15, duration: "30 days" },
    educational: { name: "Educational License", price: 75, duration: "1 year" },
    standard: { name: "Standard License", price: script.price, duration: "6 months" }
  };

  const currentLicense = licenseOptions[licenseType as keyof typeof licenseOptions];
  const royaltyRate = licenseType === "standard" ? 8 : 0;
  const estimatedRoyalties = formData.venue.capacity * (formData.ticketPrices.adult || 25) * 0.08;

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return formData.performanceDates.start && formData.venue.name && formData.venue.capacity > 0;
      case 1:
        return formData.productionTitle && formData.director;
      case 2:
        return formData.cardInfo.number && formData.cardInfo.name;
      case 3:
        return formData.acceptTerms && (licenseType !== "standard" || formData.acceptRoyalties);
      default:
        return true;
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

  const handleSubmit = () => {
    onComplete(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-background rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold theater-heading">License Checkout</h2>
            <p className="text-muted-foreground">{script.title} by {script.playwright}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
        </div>

        {/* Progress */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index < currentStep ? 'bg-primary text-primary-foreground' :
                  index === currentStep ? 'bg-primary/20 text-primary' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 w-16 mx-2 ${
                    index < currentStep ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h3 className="font-semibold">{steps[currentStep].title}</h3>
            <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {/* Step 0: License Details */}
          {currentStep === 0 && (
            <div className="space-y-6">
              <Card className="theater-card">
                <CardHeader>
                  <CardTitle>Selected License</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{currentLicense.name}</h3>
                      <p className="text-sm text-muted-foreground">Valid for {currentLicense.duration}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">${currentLicense.price}</div>
                      {royaltyRate > 0 && (
                        <div className="text-sm text-muted-foreground">+ {royaltyRate}% royalties</div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="theater-card">
                <CardHeader>
                  <CardTitle>Performance Dates</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.performanceDates.start}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          performanceDates: { ...prev.performanceDates, start: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.performanceDates.end}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          performanceDates: { ...prev.performanceDates, end: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="theater-card">
                <CardHeader>
                  <CardTitle>Venue Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="venueName">Venue Name *</Label>
                      <Input
                        id="venueName"
                        value={formData.venue.name}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          venue: { ...prev.venue, name: e.target.value }
                        }))}
                        placeholder="Theater name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Seating Capacity *</Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={formData.venue.capacity || ""}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          venue: { ...prev.venue, capacity: parseInt(e.target.value) || 0 }
                        }))}
                        placeholder="Number of seats"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      value={formData.venue.address}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        venue: { ...prev.venue, address: e.target.value }
                      }))}
                      placeholder="Street address"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.venue.city}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          venue: { ...prev.venue, city: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={formData.venue.state}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          venue: { ...prev.venue, state: e.target.value }
                        }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zip">ZIP Code</Label>
                      <Input
                        id="zip"
                        value={formData.venue.zipCode}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          venue: { ...prev.venue, zipCode: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 1: Production Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <Card className="theater-card">
                <CardHeader>
                  <CardTitle>Production Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="productionTitle">Production Title *</Label>
                    <Input
                      id="productionTitle"
                      value={formData.productionTitle}
                      onChange={(e) => setFormData(prev => ({ ...prev, productionTitle: e.target.value }))}
                      placeholder="Your production's title"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="director">Director *</Label>
                      <Input
                        id="director"
                        value={formData.director}
                        onChange={(e) => setFormData(prev => ({ ...prev, director: e.target.value }))}
                        placeholder="Director's name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="producer">Producer</Label>
                      <Input
                        id="producer"
                        value={formData.producer}
                        onChange={(e) => setFormData(prev => ({ ...prev, producer: e.target.value }))}
                        placeholder="Producer's name"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {licenseType === "standard" && (
                <Card className="theater-card">
                  <CardHeader>
                    <CardTitle>Ticket Pricing</CardTitle>
                    <CardDescription>Used for royalty calculations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="adultPrice">Adult Ticket</Label>
                        <Input
                          id="adultPrice"
                          type="number"
                          step="0.01"
                          value={formData.ticketPrices.adult || ""}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            ticketPrices: { ...prev.ticketPrices, adult: parseFloat(e.target.value) || 0 }
                          }))}
                          placeholder="$25.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="studentPrice">Student Ticket</Label>
                        <Input
                          id="studentPrice"
                          type="number"
                          step="0.01"
                          value={formData.ticketPrices.student || ""}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            ticketPrices: { ...prev.ticketPrices, student: parseFloat(e.target.value) || 0 }
                          }))}
                          placeholder="$15.00"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="seniorPrice">Senior Ticket</Label>
                        <Input
                          id="seniorPrice"
                          type="number"
                          step="0.01"
                          value={formData.ticketPrices.senior || ""}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            ticketPrices: { ...prev.ticketPrices, senior: parseFloat(e.target.value) || 0 }
                          }))}
                          placeholder="$20.00"
                        />
                      </div>
                    </div>
                    
                    {estimatedRoyalties > 0 && (
                      <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          Estimated royalties: ${estimatedRoyalties.toFixed(2)} per performance
                          (based on capacity and adult ticket price)
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Additional steps would continue here... */}
          {currentStep >= 2 && (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Step {currentStep + 1} content would be implemented here...
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="text-center">
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="text-xl font-bold text-primary">${currentLicense.price}</div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            {currentStep === steps.length - 1 ? (
              <Button onClick={handleSubmit} className="spotlight-button">
                Complete Purchase
              </Button>
            ) : (
              <Button
                onClick={nextStep}
                disabled={!canProceed()}
                className="spotlight-button"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};