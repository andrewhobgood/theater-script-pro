import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  ShoppingCart as CartIcon, 
  Plus, 
  Minus, 
  Trash2, 
  Tag, 
  Gift,
  CreditCard,
  X,
  Percent,
  Calculator
} from 'lucide-react';
import { mockScripts } from '@/lib/mock-data';

interface CartItem {
  id: string;
  scriptId: string;
  licenseType: 'perusal' | 'educational' | 'standard' | 'commercial';
  quantity: number;
  price: number;
  duration: number; // months
  addedAt: string;
}

interface DiscountCode {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  description: string;
  minAmount?: number;
  expiresAt?: string;
}

export const ShoppingCart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      scriptId: 'hamlet-2024',
      licenseType: 'standard',
      quantity: 1,
      price: 299,
      duration: 6,
      addedAt: new Date().toISOString()
    },
    {
      id: '2', 
      scriptId: 'romeo-juliet-2024',
      licenseType: 'educational',
      quantity: 1,
      price: 150,
      duration: 12,
      addedAt: new Date().toISOString()
    }
  ]);

  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountCode | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const availableDiscounts: DiscountCode[] = [
    {
      code: 'SPRING25',
      type: 'percentage',
      value: 25,
      description: 'Spring Season 25% Off',
      minAmount: 200
    },
    {
      code: 'NEWUSER',
      type: 'fixed',
      value: 50,
      description: 'New User Discount',
      minAmount: 100
    },
    {
      code: 'EDUCATION',
      type: 'percentage', 
      value: 40,
      description: 'Educational Institution Discount',
      minAmount: 150
    }
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const taxRate = 0.08; // 8% tax
  const tax = subtotal * taxRate;

  let discountAmount = 0;
  if (appliedDiscount) {
    if (appliedDiscount.type === 'percentage') {
      discountAmount = subtotal * (appliedDiscount.value / 100);
    } else {
      discountAmount = appliedDiscount.value;
    }
  }

  const total = subtotal + tax - discountAmount;

  useEffect(() => {
    // Persist cart to localStorage
    localStorage.setItem('theaterscript-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    setCartItems(items => 
      items.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
  };

  const applyDiscountCode = () => {
    const discount = availableDiscounts.find(d => 
      d.code.toLowerCase() === discountCode.toLowerCase() &&
      (!d.minAmount || subtotal >= d.minAmount)
    );
    
    if (discount) {
      setAppliedDiscount(discount);
      setDiscountCode('');
    } else {
      alert('Invalid discount code or minimum amount not met');
    }
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
  };

  const getLicenseTypeDisplay = (type: string) => {
    const types = {
      perusal: { label: 'Perusal', color: 'bg-blue-100 text-blue-800' },
      educational: { label: 'Educational', color: 'bg-green-100 text-green-800' },
      standard: { label: 'Standard', color: 'bg-purple-100 text-purple-800' },
      commercial: { label: 'Commercial', color: 'bg-orange-100 text-orange-800' }
    };
    return types[type as keyof typeof types] || types.standard;
  };

  const CartItemCard = ({ item }: { item: CartItem }) => {
    const script = mockScripts.find(s => s.id === item.scriptId);
    if (!script) return null;

    const licenseDisplay = getLicenseTypeDisplay(item.licenseType);

    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold">{script.title}</h3>
              <p className="text-sm text-muted-foreground">by {script.playwright}</p>
              
              <div className="flex items-center gap-2 mt-2">
                <Badge className={licenseDisplay.color} variant="secondary">
                  {licenseDisplay.label} License
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {item.duration} months
                </span>
              </div>
              
              <div className="flex items-center gap-2 mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="h-8 w-8 p-0"
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="h-8 w-8 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="text-right">
              <div className="font-semibold text-lg">${item.price * item.quantity}</div>
              <p className="text-sm text-muted-foreground">${item.price} each</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.id)}
                className="mt-2 text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      {/* Cart Icon Button */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="relative">
            <CartIcon className="h-4 w-4" />
            {cartItems.length > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs flex items-center justify-center"
              >
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
        
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CartIcon className="h-5 w-5" />
              Shopping Cart ({cartItems.length} items)
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <CartIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                <p className="text-muted-foreground mb-4">Add some scripts to get started</p>
                <Button onClick={() => setIsCartOpen(false)}>Browse Scripts</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Cart Items */}
                <div className="space-y-3">
                  {cartItems.map(item => (
                    <CartItemCard key={item.id} item={item} />
                  ))}
                </div>

                <Separator />

                {/* Discount Code Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Tag className="h-4 w-4" />
                      Discount Code
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {appliedDiscount ? (
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div>
                          <div className="font-medium text-green-800">{appliedDiscount.code}</div>
                          <div className="text-sm text-green-600">{appliedDiscount.description}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-green-800">
                            -{appliedDiscount.type === 'percentage' ? `${appliedDiscount.value}%` : `$${appliedDiscount.value}`}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={removeDiscount}
                            className="h-6 w-6 p-0 text-green-600"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter discount code"
                          value={discountCode}
                          onChange={(e) => setDiscountCode(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && applyDiscountCode()}
                        />
                        <Button onClick={applyDiscountCode} variant="outline">
                          Apply
                        </Button>
                      </div>
                    )}
                    
                    {/* Available Discounts (for demo) */}
                    <div className="text-xs text-muted-foreground">
                      <p className="mb-1">Available codes:</p>
                      <div className="flex flex-wrap gap-1">
                        {availableDiscounts.map(discount => (
                          <Badge 
                            key={discount.code} 
                            variant="outline" 
                            className="text-xs cursor-pointer"
                            onClick={() => setDiscountCode(discount.code)}
                          >
                            {discount.code}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Separator />

                {/* Order Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Calculator className="h-4 w-4" />
                      Order Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    
                    {appliedDiscount && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount ({appliedDiscount.code})</span>
                        <span>-${discountAmount.toFixed(2)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span>Tax (8%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
          
          {/* Checkout Button */}
          {cartItems.length > 0 && (
            <div className="border-t pt-4">
              <Button className="w-full spotlight-button" size="lg">
                <CreditCard className="h-4 w-4 mr-2" />
                Proceed to Checkout (${total.toFixed(2)})
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};