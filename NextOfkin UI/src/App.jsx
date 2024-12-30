'use client'

import React, { useState, useEffect } from 'react'
import { AppConfig, showConnect, UserSession } from "@stacks/connect"
import { motion, AnimatePresence } from 'framer-motion'
import { UserCircle, Wallet, Users, History, Settings, LogOut, Plus, Trash2, AlertTriangle, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export default function App() {
  const appConfig = new AppConfig(["store_write", "publish_data"])
  const userSession = new UserSession({ appConfig })

  // State management
  const [userAddress, setUserAddress] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(sessionStorage.getItem("userAddress") || 'null')
    }
    return null
  })
  const [activeTab, setActiveTab] = useState('dashboard')
  const [beneficiaries, setBeneficiaries] = useState([])
  const [isAddingBeneficiary, setIsAddingBeneficiary] = useState(false)
  const [assets, setAssets] = useState({
    stx: '0',
    fungibleTokens: [],
    nfts: []
  })
  const [transactions, setTransactions] = useState([])

  // Inactivity monitoring states
  const [lastActiveTimestamp, setLastActiveTimestamp] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(sessionStorage.getItem("lastActiveTimestamp") || Date.now().toString())
    }
    return Date.now()
  })
  const [inactivityThreshold, setInactivityThreshold] = useState(365) // days
  const [isInactivityWarningVisible, setIsInactivityWarningVisible] = useState(false)

  const handleConnect = () => {
    showConnect({
      appDetails: {
        name: "Next of Kin DApp",
        icon: "",
      },
      onFinish: () => {
        const userData = userSession.loadUserData()
        const testnetAddress = userData.profile.stxAddress.testnet

        setUserAddress(testnetAddress)
        setLastActiveTimestamp(Date.now())
        sessionStorage.setItem("userAddress", JSON.stringify(testnetAddress))
        sessionStorage.setItem("lastActiveTimestamp", Date.now().toString())
        fetchUserData(testnetAddress)
      },
      userSession,
    })
  }

  // Inactivity monitoring effect
  useEffect(() => {
    const checkInactivity = () => {
      const currentTime = Date.now()
      const daysSinceLastActivity = (currentTime - lastActiveTimestamp) / (1000 * 60 * 60 * 24)

      if (daysSinceLastActivity > inactivityThreshold) {
        setIsInactivityWarningVisible(true)
      }
    }

    const inactivityTimer = setInterval(checkInactivity, 24 * 60 * 60 * 1000) // Check daily
    return () => clearInterval(inactivityTimer)
  }, [lastActiveTimestamp, inactivityThreshold])

  // Method to reset activity timestamp
  const updateLastActiveTimestamp = () => {
    const currentTime = Date.now()
    setLastActiveTimestamp(currentTime)
    sessionStorage.setItem("lastActiveTimestamp", currentTime.toString())
  }

  const handleAddBeneficiary = (beneficiaryData) => {
    setBeneficiaries([...beneficiaries, beneficiaryData])
    setIsAddingBeneficiary(false)
    updateLastActiveTimestamp()
  }

  const handleRemoveBeneficiary = (address) => {
    setBeneficiaries(beneficiaries.filter(b => b.address !== address))
    updateLastActiveTimestamp()
  }

  const fetchUserData = (address) => {
    // Simulated data fetching
    setAssets({
      stx: '1000',
      fungibleTokens: [
        { name: 'Token A', balance: '500' },
        { name: 'Token B', balance: '200' }
      ],
      nfts: [
        { name: 'NFT 1', id: '1' },
        { name: 'NFT 2', id: '2' }
      ]
    })
    setTransactions([
      { id: '1', type: 'send', amount: '100 STX', recipient: 'ST1...', date: '2023-06-01' },
      { id: '2', type: 'receive', amount: '50 STX', sender: 'ST2...', date: '2023-05-28' }
    ])
    setBeneficiaries([
      { name: 'Alice', address: 'ST3...', share: '50%' },
      { name: 'Bob', address: 'ST4...', share: '50%' }
    ])
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assets Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p><strong>STX Balance:</strong> {assets.stx} STX</p>
                  <p><strong>Fungible Tokens:</strong></p>
                  <ul className="list-disc list-inside">
                    {assets.fungibleTokens.map((token, index) => (
                      <li key={index}>{token.name}: {token.balance}</li>
                    ))}
                  </ul>
                  <p><strong>NFTs:</strong></p>
                  <ul className="list-disc list-inside">
                    {assets.nfts.map((nft, index) => (
                      <li key={index}>{nft.name} (ID: {nft.id})</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case 'beneficiaries':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Beneficiaries</CardTitle>
                <CardDescription>Manage your beneficiaries here</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {beneficiaries.map((beneficiary, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                      <div>
                        <p className="font-semibold">{beneficiary.name}</p>
                        <p className="text-sm text-muted-foreground">{beneficiary.address}</p>
                        <p className="text-sm">Share: {beneficiary.share}</p>
                      </div>
                      <Button variant="destructive" size="icon" onClick={() => handleRemoveBeneficiary(beneficiary.address)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => setIsAddingBeneficiary(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Add Beneficiary
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Beneficiary</DialogTitle>
                      <DialogDescription>Enter the details of the new beneficiary.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Input id="name" placeholder="Name" />
                      <Input id="address" placeholder="Stacks Address" />
                      <Input id="share" placeholder="Share (%)" />
                    </div>
                    <DialogFooter>
                      <Button onClick={() => handleAddBeneficiary({ name: 'New Beneficiary', address: 'ST...', share: '25%' })}>Add</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardFooter>
            </Card>
          </div>
        )
      case 'transactions':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {transactions.map((tx, index) => (
                    <div key={index} className="flex items-center justify-between py-4">
                      <div>
                        <p className="font-semibold">{tx.type === 'send' ? 'Sent' : 'Received'} {tx.amount}</p>
                        <p className="text-sm text-muted-foreground">
                          {tx.type === 'send' ? `To: ${tx.recipient}` : `From: ${tx.sender}`}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">{tx.date}</p>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )
      case 'settings':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Inactivity Settings</CardTitle>
                <CardDescription>Configure the inactivity threshold for inheritance protocol</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="inactivityThreshold" className="text-sm font-medium">
                      Inactivity Threshold (Days)
                    </label>
                    <Input
                      id="inactivityThreshold"
                      type="number"
                      value={inactivityThreshold}
                      onChange={(e) => setInactivityThreshold(Number(e.target.value))}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Set the number of days of inactivity before inheritance protocol is triggered.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <Sidebar>
          <SidebarHeader className="p-4">
            <h2 className="text-lg font-semibold">Next of Kin DApp</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveTab('dashboard')} isActive={activeTab === 'dashboard'}>
                  <Wallet className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveTab('beneficiaries')} isActive={activeTab === 'beneficiaries'}>
                  <Users className="mr-2 h-4 w-4" />
                  <span>Beneficiaries</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveTab('transactions')} isActive={activeTab === 'transactions'}>
                  <History className="mr-2 h-4 w-4" />
                  <span>Transactions</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => setActiveTab('settings')} isActive={activeTab === 'settings'}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4">
            {userAddress ? (
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{userAddress.slice(0, 6)}...{userAddress.slice(-4)}</p>
                  <Button variant="ghost" size="sm" onClick={() => setUserAddress(null)}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Disconnect
                  </Button>
                </div>
              </div>
            ) : (
              <Button onClick={handleConnect} className="w-full">
                <UserCircle className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            )}
          </SidebarFooter>
        </Sidebar>
        <main className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <Dialog open={isInactivityWarningVisible} onOpenChange={setIsInactivityWarningVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Inactivity Detected
            </DialogTitle>
            <DialogDescription>
              You have been inactive for more than {inactivityThreshold} days. 
              Your assets may be at risk of being transferred to your designated beneficiaries.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => {
              setIsInactivityWarningVisible(false)
              updateLastActiveTimestamp()
            }}>
              I'm Active
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}

