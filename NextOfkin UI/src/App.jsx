import React, { useState, useEffect } from 'react';
import { AppConfig, showConnect, UserSession } from "@stacks/connect";
import {
  UserCircle,
  Wallet,
  Users,
  History,
  Settings,
  LogOut,
  Plus,
  Trash2
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

const App = () => {
  const appConfig = new AppConfig(["store_write", "publish_data"]);
  const userSession = new UserSession({ appConfig });

  // State management
  const [userAddress, setUserAddress] = useState(() => {
    return JSON.parse(sessionStorage.getItem("userAddress"));
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [isAddingBeneficiary, setIsAddingBeneficiary] = useState(false);
  const [assets, setAssets] = useState({
    stx: '0',
    fungibleTokens: [],
    nfts: []
  });
  const [transactions, setTransactions] = useState([]);

  // Connect wallet handler
  const handleConnect = () => {
    showConnect({
      appDetails: {
        name: "Next of Kin DApp",
        icon: "",
      },
      onFinish: () => {
        const userData = userSession.loadUserData();
        const testnetAddress = userData.profile.stxAddress.testnet;

        setUserAddress(testnetAddress);
        sessionStorage.setItem("userAddress", JSON.stringify(testnetAddress));
        // Here you would typically fetch user's assets and beneficiaries
        fetchUserData(testnetAddress);
      },
      userSession,
    });
  };

  // Fetch user data (mock implementation)
  const fetchUserData = (address) => {
    // Mock data - replace with actual contract calls
    setAssets({
      stx: '1000.00',
      fungibleTokens: [
        { name: 'STX', balance: '500.00' },
        { name: 'BTC', balance: '750.00' }
      ],
      nfts: [
        { name: 'CryptoPunk #123', id: '123' },
        { name: 'Bored Ape #456', id: '456' }
      ]
    });

    setBeneficiaries([
      {
        address: 'ST1234...ABCD',
        percentage: 60,
        name: 'Walter',
        relationship: 'Brother'
      },
      {
        address: 'ST5678...EFGH',
        percentage: 40,
        name: 'Bob',
        relationship: 'Brother'
      }
    ]);

    setTransactions([
      {
        type: 'Add Beneficiary',
        address: 'ST1234...ABCD',
        timestamp: '2024-10-26 14:30',
        status: 'Completed'
      },
      {
        type: 'Update Percentage',
        address: 'ST5678...EFGH',
        timestamp: '2024-10-26 14:35',
        status: 'Pending'
      }
    ]);
  };

  // Disconnect wallet
  const handleDisconnect = () => {
    userSession.signUserOut();
    sessionStorage.clear();
    setUserAddress(null);
    setBeneficiaries([]);
    setAssets({
      stx: '0',
      fungibleTokens: [],
      nfts: []
    });
    setTransactions([]);
  };

  // Add beneficiary handler (mock implementation)
  const handleAddBeneficiary = (beneficiaryData) => {
    setBeneficiaries([...beneficiaries, beneficiaryData]);
    setIsAddingBeneficiary(false);
  };

  // Remove beneficiary handler (mock implementation)
  const handleRemoveBeneficiary = (address) => {
    setBeneficiaries(beneficiaries.filter(b => b.address !== address));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-yellow-800 py-4 px-6 flex items-center justify-between">
        <h1 className="text-white text-2xl font-bold">NextOfKin DApp</h1>
        {!userAddress ? (
          <Button
            onClick={handleConnect}
            className="bg-black hover:bg-gray-800"
          >
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        ) : (
          <div className="flex items-center space-x-4">
            <span className="text-white">
              {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
            </span>
            <Button
              variant="outline"
              onClick={handleDisconnect}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Disconnect
            </Button>
          </div>
        )}
      </nav>

      {userAddress && (
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <div className="w-64 bg-white shadow-lg">
            <div className="p-4">
              <div className="space-y-2">
                <Button
                  variant={activeTab === 'dashboard' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('dashboard')}
                >
                  <UserCircle className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                <Button
                  variant={activeTab === 'beneficiaries' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('beneficiaries')}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Beneficiaries
                </Button>
                <Button
                  variant={activeTab === 'history' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('history')}
                >
                  <History className="mr-2 h-4 w-4" />
                  History
                </Button>
                <Button
                  variant={activeTab === 'settings' ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('settings')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-8">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Dashboard</h2>

                {/* Asset Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Asset Overview</CardTitle>
                    <CardDescription>Your current holdings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>STX Balance:</span>
                        <span className="font-bold">{assets.stx} STX</span>
                      </div>
                      {assets.fungibleTokens.map((token, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span>{token.name}:</span>
                          <span className="font-bold">{token.balance}</span>
                        </div>
                      ))}
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">NFTs</h4>
                        <div className="grid grid-cols-2 gap-4">
                          {assets.nfts.map((nft, index) => (
                            <Card key={index}>
                              <CardContent className="p-4">
                                <div className="aspect-square bg-gray-200 mb-2 rounded" />
                                <p className="text-sm">{nft.name}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'beneficiaries' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold">Beneficiaries</h2>
                  <Dialog open={isAddingBeneficiary} onOpenChange={setIsAddingBeneficiary}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Beneficiary
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Beneficiary</DialogTitle>
                        <DialogDescription>
                          Add a new beneficiary to your inheritance plan.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label>Name</label>
                          <Input placeholder="Enter beneficiary name" />
                        </div>
                        <div className="space-y-2">
                          <label>Wallet Address</label>
                          <Input placeholder="Enter STX address" />
                        </div>
                        <div className="space-y-2">
                          <label>Relationship</label>
                          <Input placeholder="Enter relationship" />
                        </div>
                        <div className="space-y-2">
                          <label>Percentage</label>
                          <Input type="number" placeholder="Enter percentage" min="0" max="100" />
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => handleAddBeneficiary({
                            address: 'ST90123...WXYZ',
                            percentage: 20,
                            name: 'Carol',
                            relationship: 'Daughter'
                          })}
                        >
                          Add Beneficiary
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid gap-4">
                  {beneficiaries.map((beneficiary, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{beneficiary.name}</h3>
                            <p className="text-sm text-gray-500">{beneficiary.relationship}</p>
                            <p className="text-sm font-mono">{beneficiary.address}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-lg font-bold">{beneficiary.percentage}%</span>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveBeneficiary(beneficiary.address)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {beneficiaries.length === 0 && (
                  <Alert>
                    <AlertTitle>No Beneficiaries</AlertTitle>
                    <AlertDescription>
                      You haven't added any beneficiaries yet. Click the "Add Beneficiary" button to get started.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Transaction History</h2>
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {transactions.map((tx, index) => (
                        <div key={index} className="p-4">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-semibold">{tx.type}</p>
                              <p className="text-sm text-gray-500">{tx.address}</p>
                              <p className="text-sm text-gray-500">{tx.timestamp}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-sm ${tx.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                              }`}>
                              {tx.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Settings</h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-semibold mb-2">Wallet Address</h3>
                        <p className="font-mono text-sm">{userAddress}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Network</h3>
                        <p>Stacks Testnet</p>
                      </div>
                      <Button variant="outline" className="w-full" onClick={handleDisconnect}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Disconnect Wallet
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;