import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/context/LanguageContext';
import { 
  DollarSign, 
  TrendingUp, 
  Search, 
  Shield, 
  Plus,
  Download,
  Filter
} from 'lucide-react';

// TODO: remove mock functionality - replace with real blockchain data
const mockSalesData = [
  {
    id: 1,
    transactionId: 'TX-2024-001',
    cattleId: 'C-1189',
    cattleName: 'Luna',
    buyer: 'Premium Beef Co.',
    saleType: 'Live Cattle',
    weight: '580kg',
    pricePerKg: '$8.50',
    totalAmount: '$4,930',
    date: '2024-01-15',
    status: 'completed',
    blockchainHash: '0x1a2b3c4d5e6f7890...',
    verified: true,
    certificates: ['Health Certificate', 'Origin Certificate']
  },
  {
    id: 2,
    transactionId: 'TX-2024-002',
    cattleId: 'C-1156',
    cattleName: 'Max',
    buyer: 'Local Dairy Farm',
    saleType: 'Breeding Bull',
    weight: '750kg',
    pricePerKg: '$12.00',
    totalAmount: '$9,000',
    date: '2024-01-12',
    status: 'completed',
    blockchainHash: '0x9876543210abcdef...',
    verified: true,
    certificates: ['Health Certificate', 'Breeding Certificate', 'Genetic Certificate']
  },
  {
    id: 3,
    transactionId: 'TX-2024-003',
    cattleId: 'C-1247',
    cattleName: 'Bella',
    buyer: 'Organic Dairy Co.',
    saleType: 'Milk Production Rights',
    weight: '650kg',
    pricePerKg: '$0.75/L',
    totalAmount: '$2,250/month',
    date: '2024-01-10',
    status: 'active',
    blockchainHash: '0xabcdef1234567890...',
    verified: true,
    certificates: ['Health Certificate', 'Organic Certificate']
  }
];

const mockBlockchainStats = {
  totalTransactions: 247,
  verifiedTransactions: 245,
  totalValue: '$892,340',
  monthlyGrowth: '+12.5%'
};

export default function SalesRecords() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('transactions');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'active':
        return 'secondary';
      case 'pending':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const filteredTransactions = mockSalesData.filter(
    (transaction) =>
      transaction.cattleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 space-y-6 p-6" data-testid="page-sales-records">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t('nav.sales')}</h2>
        <p className="text-muted-foreground">
          Blockchain-verified sales transactions and livestock records
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card data-testid="card-total-transactions">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockBlockchainStats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">All time records</p>
          </CardContent>
        </Card>

        <Card data-testid="card-verified-transactions">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified on Blockchain</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{mockBlockchainStats.verifiedTransactions}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((mockBlockchainStats.verifiedTransactions / mockBlockchainStats.totalTransactions) * 100)}% verification rate
            </p>
          </CardContent>
        </Card>

        <Card data-testid="card-total-value">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockBlockchainStats.totalValue}</div>
            <p className="text-xs text-muted-foreground">Lifetime sales</p>
          </CardContent>
        </Card>

        <Card data-testid="card-monthly-growth">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{mockBlockchainStats.monthlyGrowth}</div>
            <p className="text-xs text-muted-foreground">vs last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} data-testid="tabs-sales-records">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="transactions" data-testid="tab-transactions">
            <DollarSign className="h-4 w-4 mr-2" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="blockchain" data-testid="tab-blockchain">
            <Shield className="h-4 w-4 mr-2" />
            Blockchain Records
          </TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-6">
          <Card data-testid="card-transaction-list">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sales Transactions</CardTitle>
                <CardDescription>
                  Complete record of livestock sales and transactions
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" data-testid="button-export-transactions">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button data-testid="button-add-transaction">
                  <Plus className="h-4 w-4 mr-2" />
                  New Sale
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-transactions"
                  />
                </div>
                <Button variant="outline" data-testid="button-filter-transactions">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              <div className="space-y-4">
                {filteredTransactions.map((transaction) => (
                  <div key={transaction.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{transaction.transactionId}</p>
                        <p className="text-sm text-muted-foreground">
                          {transaction.cattleName} ({transaction.cattleId}) → {transaction.buyer}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{transaction.totalAmount}</p>
                        <Badge variant={getStatusColor(transaction.status)}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Sale Type</p>
                        <p className="font-medium">{transaction.saleType}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Weight</p>
                        <p className="font-medium">{transaction.weight}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Price/kg</p>
                        <p className="font-medium">{transaction.pricePerKg}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Date</p>
                        <p className="font-medium">{transaction.date}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {transaction.verified && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <Shield className="h-3 w-3 mr-1" />
                            Blockchain Verified
                          </Badge>
                        )}
                        <div className="flex gap-1">
                          {transaction.certificates.map((cert, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button size="sm" variant="outline" data-testid={`button-view-transaction-${transaction.id}`}>
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blockchain" className="space-y-6">
          <Card data-testid="card-blockchain-verification">
            <CardHeader>
              <CardTitle>Blockchain Verification</CardTitle>
              <CardDescription>
                Immutable transaction records on the blockchain
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockSalesData.map((transaction) => (
                <div key={transaction.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium">{transaction.transactionId}</p>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Blockchain Hash</p>
                      <p className="text-sm font-mono bg-muted p-2 rounded">
                        {transaction.blockchainHash}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Cattle</p>
                        <p className="font-medium">{transaction.cattleName} ({transaction.cattleId})</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Amount</p>
                        <p className="font-medium">{transaction.totalAmount}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-3">
                    <Button size="sm" variant="outline" data-testid={`button-verify-blockchain-${transaction.id}`}>
                      Verify on Blockchain
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}