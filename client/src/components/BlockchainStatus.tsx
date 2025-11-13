import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  Users,
  FileText,
  ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BlockchainStatusProps {
  cattleId?: string;
  rfidId?: string;
  showActions?: boolean;
}

export default function BlockchainStatus({ cattleId, rfidId, showActions = true }: BlockchainStatusProps) {
  const [loading, setLoading] = useState(false);
  const [blockchainEnabled, setBlockchainEnabled] = useState(false);
  const [cattle, setCattle] = useState<any>(null);
  const [vaccinations, setVaccinations] = useState<any[]>([]);
  const [ownershipHistory, setOwnershipHistory] = useState<any[]>([]);
  const [heritage, setHeritage] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    checkBlockchainStatus();
    if (rfidId) {
      loadBlockchainData();
    }
  }, [rfidId]);

  const checkBlockchainStatus = async () => {
    try {
      const response = await fetch('/api/blockchain/status');
      if (response.ok) {
        const data = await response.json();
        setBlockchainEnabled(data.enabled);
      }
    } catch (error) {
      console.error('Failed to check blockchain status:', error);
    }
  };

  const loadBlockchainData = async () => {
    if (!rfidId || !blockchainEnabled) return;

    try {
      // Load cattle info
      const cattleRes = await fetch(`/api/blockchain/cattle/${rfidId}`);
      if (cattleRes.ok) {
        const cattleData = await cattleRes.json();
        setCattle(cattleData);
      }

      // Load vaccinations
      const vacRes = await fetch(`/api/blockchain/vaccinations/${rfidId}`);
      if (vacRes.ok) {
        const vacData = await vacRes.json();
        setVaccinations(vacData);
      }

      // Load ownership history
      const ownerRes = await fetch(`/api/blockchain/ownership/${rfidId}`);
      if (ownerRes.ok) {
        const ownerData = await ownerRes.json();
        setOwnershipHistory(ownerData);
      }

      // Load heritage
      const heritageRes = await fetch(`/api/blockchain/heritage/${rfidId}`);
      if (heritageRes.ok) {
        const heritageData = await heritageRes.json();
        setHeritage(heritageData);
      }
    } catch (error) {
      console.error('Failed to load blockchain data:', error);
    }
  };

  const handleRegisterOnBlockchain = async () => {
    if (!cattleId) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/blockchain/cattle/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ cattleId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to register on blockchain');
      }

      const data = await response.json();
      
      toast({
        title: 'Success',
        description: 'Cattle registered on blockchain successfully',
      });

      // Reload blockchain data
      if (rfidId) {
        await loadBlockchainData();
      }

      // Open explorer in new tab
      if (data.explorerUrl) {
        window.open(data.explorerUrl, '_blank');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!blockchainEnabled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Blockchain Verification
          </CardTitle>
          <CardDescription>Immutable record keeping with blockchain technology</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Blockchain integration is currently disabled. Enable it in your environment settings to track cattle records on the blockchain.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!cattle && showActions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Blockchain Verification
          </CardTitle>
          <CardDescription>Register this cattle on the blockchain for immutable record keeping</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This cattle is not yet registered on the blockchain. Register it to enable:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Immutable ownership records</li>
                <li>Verifiable vaccination history</li>
                <li>Transparent heritage tracking</li>
                <li>Fraud prevention and authenticity</li>
              </ul>
            </AlertDescription>
          </Alert>

          <Button onClick={handleRegisterOnBlockchain} disabled={loading} className="w-full">
            <Shield className="mr-2 h-4 w-4" />
            {loading ? 'Registering...' : 'Register on Blockchain'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!cattle) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Blockchain Status Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600" />
              Blockchain Verified
            </span>
            <Badge className="bg-green-600">
              <CheckCircle2 className="h-3 w-3 mr-1" />
              On Chain
            </Badge>
          </CardTitle>
          <CardDescription>
            This cattle's records are permanently stored on Polygon blockchain
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">RFID</div>
              <div className="font-medium">{cattle.rfid}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Breed</div>
              <div className="font-medium">{cattle.breed}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Gender</div>
              <div className="font-medium">{cattle.gender}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Registered</div>
              <div className="font-medium">
                {new Date(cattle.registrationTimestamp * 1000).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current Owner</span>
              <span className="font-medium">{cattle.currentOwnerName}</span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm text-muted-foreground">CNIC</span>
              <span className="font-mono text-sm">{cattle.currentOwnerCNIC}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ownership History */}
      {ownershipHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Ownership History
            </CardTitle>
            <CardDescription>Complete chain of custody on blockchain</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ownershipHistory.map((owner, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{owner.ownerName}</div>
                    <div className="text-sm text-muted-foreground">CNIC: {owner.ownerCNIC}</div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      {new Date(owner.timestamp).toLocaleString()}
                    </div>
                  </div>
                  {index < ownershipHistory.length - 1 && (
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vaccination History */}
      {vaccinations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Blockchain Vaccination Records
            </CardTitle>
            <CardDescription>Verified vaccination history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {vaccinations.map((vac, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="font-medium">{vac.vaccineName}</div>
                  <div className="text-sm text-muted-foreground">
                    Administered: {new Date(vac.vaccinationDate).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Recorded: {new Date(vac.recordedAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Heritage Information */}
      {heritage && heritage.fatherRfid && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Heritage Information
            </CardTitle>
            <CardDescription>Verified lineage on blockchain</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Father RFID</div>
                <div className="font-medium font-mono">{heritage.fatherRfid}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Mother RFID</div>
                <div className="font-medium font-mono">{heritage.motherRfid}</div>
              </div>
              {heritage.certification && (
                <div className="col-span-2">
                  <div className="text-sm text-muted-foreground">Certification</div>
                  <div className="font-medium">{heritage.certification}</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* View on Explorer Button */}
      <Button variant="outline" className="w-full" asChild>
        <a 
          href={`https://amoy.polygonscan.com/address/0x3Fe4a2EDFdA338B049331bee4a66F500A2e9682a`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          View Contract on Polygon Explorer
        </a>
      </Button>
    </div>
  );
}
