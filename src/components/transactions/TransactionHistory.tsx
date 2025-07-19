import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Receipt, 
  Download, 
  Search, 
  Filter, 
  Calendar,
  CreditCard,
  RefreshCw,
  Eye,
  FileText,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpDown
} from 'lucide-react';

interface Transaction {
  id: string;
  type: 'purchase' | 'renewal' | 'refund' | 'credit';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: string;
  amount: number;
  currency: string;
  description: string;
  scriptTitle?: string;
  licenseType?: string;
  paymentMethod: {
    type: 'card' | 'paypal' | 'bank';
    last4?: string;
    brand?: string;
  };
  invoice?: {
    id: string;
    url: string;
  };
  refundable: boolean;
  refundDeadline?: string;
  orderDetails: {
    items: Array<{
      name: string;
      price: number;
      quantity: number;
    }>;
    subtotal: number;
    tax: number;
    total: number;
  };
}

export const TransactionHistory: React.FC = () => {
  const [transactions] = useState<Transaction[]>([
    {
      id: 'txn-001',
      type: 'purchase',
      status: 'completed',
      date: '2024-01-15T10:30:00Z',
      amount: 299.00,
      currency: 'USD',
      description: 'Hamlet Standard License',
      scriptTitle: 'Hamlet: A Modern Adaptation',
      licenseType: 'standard',
      paymentMethod: {
        type: 'card',
        last4: '4242',
        brand: 'Visa'
      },
      invoice: {
        id: 'inv-001',
        url: '/invoices/inv-001.pdf'
      },
      refundable: true,
      refundDeadline: '2024-02-14T10:30:00Z',
      orderDetails: {
        items: [
          { name: 'Hamlet Standard License', price: 299.00, quantity: 1 }
        ],
        subtotal: 299.00,
        tax: 23.92,
        total: 322.92
      }
    },
    {
      id: 'txn-002',
      type: 'purchase',
      status: 'completed',
      date: '2024-02-01T14:20:00Z',
      amount: 150.00,
      currency: 'USD',
      description: 'Romeo & Juliet Educational License',
      scriptTitle: 'Romeo & Juliet',
      licenseType: 'educational',
      paymentMethod: {
        type: 'card',
        last4: '1234',
        brand: 'MasterCard'
      },
      invoice: {
        id: 'inv-002',
        url: '/invoices/inv-002.pdf'
      },
      refundable: true,
      refundDeadline: '2024-03-02T14:20:00Z',
      orderDetails: {
        items: [
          { name: 'Romeo & Juliet Educational License', price: 150.00, quantity: 1 }
        ],
        subtotal: 150.00,
        tax: 12.00,
        total: 162.00
      }
    },
    {
      id: 'txn-003',
      type: 'renewal',
      status: 'pending',
      date: '2024-02-15T09:15:00Z',
      amount: 199.00,
      currency: 'USD',
      description: 'Macbeth License Renewal',
      scriptTitle: 'Macbeth',
      licenseType: 'standard',
      paymentMethod: {
        type: 'card',
        last4: '4242',
        brand: 'Visa'
      },
      refundable: false,
      orderDetails: {
        items: [
          { name: 'Macbeth License Renewal', price: 199.00, quantity: 1 }
        ],
        subtotal: 199.00,
        tax: 15.92,
        total: 214.92
      }
    },
    {
      id: 'txn-004',
      type: 'refund',
      status: 'completed',
      date: '2024-01-20T16:45:00Z',
      amount: -75.00,
      currency: 'USD',
      description: 'Partial refund for Othello License',
      scriptTitle: 'Othello',
      licenseType: 'perusal',
      paymentMethod: {
        type: 'card',
        last4: '5678',
        brand: 'Visa'
      },
      refundable: false,
      orderDetails: {
        items: [
          { name: 'Othello Perusal License Refund', price: -75.00, quantity: 1 }
        ],
        subtotal: -75.00,
        tax: -6.00,
        total: -81.00
      }
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('date-desc');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.scriptTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'date-desc':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'date-asc':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'amount-desc':
        return Math.abs(b.amount) - Math.abs(a.amount);
      case 'amount-asc':
        return Math.abs(a.amount) - Math.abs(b.amount);
      default:
        return 0;
    }
  });

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'refunded': return <RefreshCw className="h-4 w-4 text-blue-500" />;
      default: return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: Transaction['type']) => {
    switch (type) {
      case 'purchase': return 'bg-green-100 text-green-800';
      case 'renewal': return 'bg-blue-100 text-blue-800';
      case 'refund': return 'bg-orange-100 text-orange-800';
      case 'credit': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    });
    return formatter.format(amount);
  };

  const canRefund = (transaction: Transaction) => {
    if (!transaction.refundable || !transaction.refundDeadline) return false;
    return new Date(transaction.refundDeadline) > new Date();
  };

  const totalSpent = transactions
    .filter(t => t.type !== 'refund' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalRefunded = transactions
    .filter(t => t.type === 'refund' && t.status === 'completed')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold theater-heading">Transaction History</h2>
          <p className="text-muted-foreground">View and manage your payment history</p>
        </div>
        
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-2xl font-bold">${totalSpent.toFixed(2)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">{transactions.length}</p>
              </div>
              <Receipt className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Refunded</p>
                <p className="text-2xl font-bold">${totalRefunded.toFixed(2)}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">
                  {transactions.filter(t => t.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="purchase">Purchase</SelectItem>
                <SelectItem value="renewal">Renewal</SelectItem>
                <SelectItem value="refund">Refund</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Date (Newest)</SelectItem>
                <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                <SelectItem value="amount-desc">Amount (High to Low)</SelectItem>
                <SelectItem value="amount-asc">Amount (Low to High)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transaction List */}
      <div className="space-y-4">
        {filteredTransactions.map(transaction => (
          <Card key={transaction.id} className="theater-card hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(transaction.status)}
                        <h3 className="font-semibold">{transaction.description}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Transaction ID: {transaction.id}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(transaction.status)} variant="secondary">
                        {transaction.status}
                      </Badge>
                      <Badge className={getTypeColor(transaction.type)} variant="secondary">
                        {transaction.type}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Amount</p>
                      <p className="font-semibold text-lg">
                        {formatAmount(transaction.amount, transaction.currency)}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-muted-foreground">Date</p>
                      <p className="font-medium">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(transaction.date).toLocaleTimeString()}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-muted-foreground">Payment Method</p>
                      <p className="font-medium flex items-center gap-1">
                        <CreditCard className="h-3 w-3" />
                        {transaction.paymentMethod.brand} •••• {transaction.paymentMethod.last4}
                      </p>
                    </div>
                    
                    {transaction.scriptTitle && (
                      <div>
                        <p className="text-muted-foreground">Script</p>
                        <p className="font-medium">{transaction.scriptTitle}</p>
                        {transaction.licenseType && (
                          <p className="text-xs text-muted-foreground capitalize">
                            {transaction.licenseType} license
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex flex-col gap-2 lg:w-48">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => setSelectedTransaction(transaction)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Transaction Details</DialogTitle>
                      </DialogHeader>
                      {selectedTransaction && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">Transaction ID</p>
                              <p className="text-sm text-muted-foreground">{selectedTransaction.id}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Status</p>
                              <Badge className={getStatusColor(selectedTransaction.status)} variant="secondary">
                                {selectedTransaction.status}
                              </Badge>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div>
                            <h4 className="font-semibold mb-2">Order Details</h4>
                            <div className="space-y-2">
                              {selectedTransaction.orderDetails.items.map((item, index) => (
                                <div key={index} className="flex justify-between">
                                  <span>{item.name} (x{item.quantity})</span>
                                  <span>{formatAmount(item.price, selectedTransaction.currency)}</span>
                                </div>
                              ))}
                              <Separator />
                              <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>{formatAmount(selectedTransaction.orderDetails.subtotal, selectedTransaction.currency)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Tax</span>
                                <span>{formatAmount(selectedTransaction.orderDetails.tax, selectedTransaction.currency)}</span>
                              </div>
                              <div className="flex justify-between font-semibold">
                                <span>Total</span>
                                <span>{formatAmount(selectedTransaction.orderDetails.total, selectedTransaction.currency)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  {transaction.invoice && (
                    <Button variant="outline" size="sm" className="w-full">
                      <Receipt className="h-4 w-4 mr-2" />
                      Download Invoice
                    </Button>
                  )}
                  
                  {canRefund(transaction) && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full text-orange-600 hover:text-orange-800"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Request Refund
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTransactions.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Receipt className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all' 
                ? 'No transactions match your current filters' 
                : 'You haven\'t made any transactions yet'}
            </p>
            <Button className="spotlight-button">
              <FileText className="h-4 w-4 mr-2" />
              Browse Scripts
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};