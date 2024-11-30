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
  Trash2,
  AlertTriangle
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
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter
} from "@/components/ui/modal";

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

  // NEW: Inactivity monitoring states
  const [lastActiveTimestamp, setLastActiveTimestamp] = useState(() => {
    return parseInt(sessionStorage.getItem("lastActiveTimestamp") || Date.now().toString());
  });
  const [inactivityThreshold, setInactivityThreshold] = useState(365); // days
  const [isInactivityWarningVisible, setIsInactivityWarningVisible] = useState(false);

  // Existing connect wallet handler
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
        setLastActiveTimestamp(Date.now());
        sessionStorage.setItem("userAddress", JSON.stringify(testnetAddress));
        sessionStorage.setItem("lastActiveTimestamp", Date.now().toString());
        fetchUserData(testnetAddress);
      },
      userSession,
    });
  };

  // NEW: Inactivity monitoring effect
  useEffect(() => {
    const checkInactivity = () => {
      const currentTime = Date.now();
      const daysSinceLastActivity = (currentTime - lastActiveTimestamp) / (1000 * 60 * 60 * 24);

      if (daysSinceLastActivity > inactivityThreshold) {
        setIsInactivityWarningVisible(true);
      }
    };

    const inactivityTimer = setInterval(checkInactivity, 24 * 60 * 60 * 1000); // Check daily
    return () => clearInterval(inactivityTimer);
  }, [lastActiveTimestamp, inactivityThreshold]);

  // Method to reset activity timestamp
  const updateLastActiveTimestamp = () => {
    const currentTime = Date.now();
    setLastActiveTimestamp(currentTime);
    sessionStorage.setItem("lastActiveTimestamp", currentTime.toString());
  };

  // Modify existing methods to update timestamp
  const handleAddBeneficiary = (beneficiaryData) => {
    setBeneficiaries([...beneficiaries, beneficiaryData]);
    setIsAddingBeneficiary(false);
    updateLastActiveTimestamp();
  };

  const handleRemoveBeneficiary = (address) => {
    setBeneficiaries(beneficiaries.filter(b => b.address !== address));
    updateLastActiveTimestamp();
  };

  // Rest of the existing code remains the same...

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Existing return content... */}
      
      {/* NEW: Inactivity Warning Modal */}
      {isInactivityWarningVisible && (
        <Modal open={true} onOpenChange={() => setIsInactivityWarningVisible(false)}>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>
                <AlertTriangle className="mr-2 inline-block" />
                Inactivity Detected
              </ModalTitle>
              <ModalDescription>
                You have been inactive for more than {inactivityThreshold} days. 
                Your assets may be at risk of being transferred to your designated beneficiaries.
              </ModalDescription>
            </ModalHeader>
            <ModalFooter>
              <Button onClick={() => setIsInactivityWarningVisible(false)}>
                I'm Active
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {/* In Settings Tab, add Inactivity Configuration */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <h3 className="font-semibold">Inactivity Monitoring</h3>
                <Input
                  type="number"
                  placeholder="Inactivity Threshold (Days)"
                  value={inactivityThreshold}
                  onChange={(e) => setInactivityThreshold(Number(e.target.value))}
                />
                <p className="text-sm text-gray-500">
                  Set the number of days of inactivity before inheritance protocol is triggered.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default App;