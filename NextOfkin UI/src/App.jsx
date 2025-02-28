"use client"

import { useState, useEffect } from "react"
import { AppConfig, showConnect, UserSession } from "@stacks/connect"
import { motion, AnimatePresence } from "framer-motion"
import {
  UserCircle,
  Wallet,
  Users,
  History,
  Settings,
  LogOut,
  Plus,
  Trash2,
  AlertTriangle,
  Sparkles,
  Shield,
  Coins,
  Gift,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function App() {
  const appConfig = new AppConfig(["store_write", "publish_data"])
  const userSession = new UserSession({ appConfig })

  // State management
  const [userAddress, setUserAddress] = useState(() => {
    if (typeof window !== "undefined") {
      return JSON.parse(sessionStorage.getItem("userAddress") || "null")
    }
    return null
  })
  const [activeTab, setActiveTab] = useState("dashboard")
  const [beneficiaries, setBeneficiaries] = useState([])
  const [isAddingBeneficiary, setIsAddingBeneficiary] = useState(false)
  const [assets, setAssets] = useState({
    stx: "0",
    fungibleTokens: [],
    nfts: [],
  })
  const [transactions, setTransactions] = useState([])

  // Inactivity monitoring states
  const [lastActiveTimestamp, setLastActiveTimestamp] = useState(() => {
    if (typeof window !== "undefined") {
      return Number.parseInt(sessionStorage.getItem("lastActiveTimestamp") || Date.now().toString())
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
    setBeneficiaries(beneficiaries.filter((b) => b.address !== address))
    updateLastActiveTimestamp()
  }

  const fetchUserData = (address) => {
    // Simulated data fetching
    setAssets({
      stx: "1000",
      fungibleTokens: [
        { name: "Token A", balance: "500", color: "#8B5CF6" },
        { name: "Token B", balance: "200", color: "#EC4899" },
      ],
      nfts: [
        { name: "NFT 1", id: "1", image: "/placeholder.svg?height=80&width=80" },
        { name: "NFT 2", id: "2", image: "/placeholder.svg?height=80&width=80" },
      ],
    })
    setTransactions([
      { id: "1", type: "send", amount: "100 STX", recipient: "ST1...", date: "2023-06-01" },
      { id: "2", type: "receive", amount: "50 STX", sender: "ST2...", date: "2023-05-28" },
      { id: "3", type: "send", amount: "25 STX", recipient: "ST3...", date: "2023-05-15" },
      { id: "4", type: "receive", amount: "75 STX", sender: "ST4...", date: "2023-05-10" },
    ])
    setBeneficiaries([
      { name: "Alice", address: "ST3...", share: "50%", color: "#8B5CF6" },
      { name: "Bob", address: "ST4...", share: "50%", color: "#EC4899" },
    ])
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-8">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-purple-600 to-blue-500 p-8 text-white shadow-lg">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
              <h1 className="mb-2 text-3xl font-bold">Welcome to Next of Kin</h1>
              <p className="mb-4 max-w-lg text-white/80">
                Secure your digital legacy with our blockchain-powered inheritance solution.
              </p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="border-white/20 bg-white/10 text-white">
                  Stacks Blockchain
                </Badge>
                <Badge variant="outline" className="border-white/20 bg-white/10 text-white">
                  Secure Inheritance
                </Badge>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card className="overflow-hidden border-none bg-gradient-to-br from-violet-50 to-violet-100 shadow-md dark:from-violet-950/30 dark:to-violet-900/30">
                <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-500 pb-8 pt-6 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    STX Balance
                  </CardTitle>
                </CardHeader>
                <CardContent className="-mt-6 rounded-t-xl bg-card px-6 py-4">
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold">{assets.stx}</div>
                    <div className="text-sm text-muted-foreground">STX</div>
                  </div>
                  <Progress
                    value={65}
                    className="mt-4 h-2 bg-violet-100 dark:bg-violet-900/30"
                    indicatorClassName="bg-violet-500"
                  />
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-none bg-gradient-to-br from-pink-50 to-pink-100 shadow-md dark:from-pink-950/30 dark:to-pink-900/30">
                <CardHeader className="bg-gradient-to-r from-pink-500 to-rose-500 pb-8 pt-6 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="h-5 w-5" />
                    Tokens
                  </CardTitle>
                </CardHeader>
                <CardContent className="-mt-6 rounded-t-xl bg-card px-6 py-4">
                  <div className="space-y-3">
                    {assets.fungibleTokens.map((token, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full" style={{ backgroundColor: token.color }}></div>
                          <span>{token.name}</span>
                        </div>
                        <span className="font-medium">{token.balance}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden border-none bg-gradient-to-br from-blue-50 to-blue-100 shadow-md dark:from-blue-950/30 dark:to-blue-900/30">
                <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 pb-8 pt-6 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    NFTs
                  </CardTitle>
                </CardHeader>
                <CardContent className="-mt-6 rounded-t-xl bg-card px-6 py-4">
                  <div className="grid grid-cols-2 gap-3">
                    {assets.nfts.map((nft, index) => (
                      <div key={index} className="overflow-hidden rounded-lg border bg-background p-2">
                        <img
                          src={nft.image || "/placeholder.svg"}
                          alt={nft.name}
                          className="mb-2 aspect-square w-full rounded-md object-cover"
                        />
                        <p className="text-center text-sm font-medium">{nft.name}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="overflow-hidden border-none bg-gradient-to-br from-slate-50 to-slate-100 shadow-md dark:from-slate-950/30 dark:to-slate-900/30">
              <CardHeader className="border-b">
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[200px]">
                  {transactions.slice(0, 3).map((tx, index) => (
                    <div key={index} className="flex items-center justify-between border-b p-4 last:border-0">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full ${tx.type === "send" ? "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"}`}
                        >
                          {tx.type === "send" ? "↑" : "↓"}
                        </div>
                        <div>
                          <p className="font-semibold">
                            {tx.type === "send" ? "Sent" : "Received"} {tx.amount}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {tx.type === "send" ? `To: ${tx.recipient}` : `From: ${tx.sender}`}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{tx.date}</p>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )
      case "beneficiaries":
        return (
          <div className="space-y-8">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-600 to-purple-500 p-8 text-white shadow-lg">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
              <h1 className="mb-2 text-3xl font-bold">Beneficiaries</h1>
              <p className="mb-4 max-w-lg text-white/80">Manage who will inherit your digital assets.</p>
            </div>

            <Card className="overflow-hidden border-none bg-gradient-to-br from-slate-50 to-slate-100 shadow-md dark:from-slate-950/30 dark:to-slate-900/30">
              <CardHeader className="border-b">
                <CardTitle>Your Beneficiaries</CardTitle>
                <CardDescription>Manage your beneficiaries here</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-4 md:grid-cols-2">
                  {beneficiaries.map((beneficiary, index) => (
                    <div
                      key={index}
                      className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md"
                    >
                      <div
                        className="absolute -right-4 -top-4 h-16 w-16 rounded-full opacity-20"
                        style={{ backgroundColor: beneficiary.color }}
                      ></div>
                      <div className="relative z-10 flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full" style={{ backgroundColor: beneficiary.color }}></div>
                            <h3 className="text-xl font-semibold">{beneficiary.name}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">{beneficiary.address}</p>
                          <Badge variant="outline" className="mt-2">
                            Share: {beneficiary.share}
                          </Badge>
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="opacity-0 transition-opacity group-hover:opacity-100"
                          onClick={() => handleRemoveBeneficiary(beneficiary.address)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <Dialog>
                    <DialogTrigger asChild>
                      <div
                        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed bg-muted/50 p-6 text-muted-foreground transition-colors hover:bg-muted"
                        onClick={() => setIsAddingBeneficiary(true)}
                      >
                        <div className="mb-2 rounded-full bg-primary/10 p-2">
                          <Plus className="h-6 w-6 text-primary" />
                        </div>
                        <p>Add New Beneficiary</p>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add New Beneficiary</DialogTitle>
                        <DialogDescription>Enter the details of the new beneficiary.</DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">
                            Name
                          </label>
                          <Input id="name" placeholder="Name" />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="address" className="text-sm font-medium">
                            Stacks Address
                          </label>
                          <Input id="address" placeholder="Stacks Address" />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="share" className="text-sm font-medium">
                            Share (%)
                          </label>
                          <Input id="share" placeholder="Share (%)" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          onClick={() =>
                            handleAddBeneficiary({
                              name: "New Beneficiary",
                              address: "ST...",
                              share: "25%",
                              color: "#10B981",
                            })
                          }
                        >
                          Add Beneficiary
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none bg-gradient-to-br from-amber-50 to-amber-100 shadow-md dark:from-amber-950/30 dark:to-amber-900/30">
              <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 pb-6 pt-6 text-white">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Inheritance Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-sm">
                    Your assets will be distributed to your beneficiaries if you remain inactive for{" "}
                    {inactivityThreshold} days. Make sure to log in regularly to prevent automatic asset distribution.
                  </p>
                  <div className="rounded-lg bg-amber-100 p-4 dark:bg-amber-900/30">
                    <h4 className="mb-2 font-semibold">Current Distribution</h4>
                    <div className="space-y-2">
                      {beneficiaries.map((beneficiary, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span>{beneficiary.name}</span>
                          <span>{beneficiary.share}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      case "transactions":
        return (
          <div className="space-y-8">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-cyan-600 to-blue-500 p-8 text-white shadow-lg">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
              <h1 className="mb-2 text-3xl font-bold">Transaction History</h1>
              <p className="mb-4 max-w-lg text-white/80">View all your blockchain transactions.</p>
            </div>

            <Card className="overflow-hidden border-none bg-gradient-to-br from-slate-50 to-slate-100 shadow-md dark:from-slate-950/30 dark:to-slate-900/30">
              <CardHeader className="border-b">
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[400px]">
                  {transactions.map((tx, index) => (
                    <div key={index} className="flex items-center justify-between border-b p-6 last:border-0">
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-full ${tx.type === "send" ? "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400" : "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"}`}
                        >
                          {tx.type === "send" ? "↑" : "↓"}
                        </div>
                        <div>
                          <p className="text-lg font-semibold">
                            {tx.type === "send" ? "Sent" : "Received"} {tx.amount}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {tx.type === "send" ? `To: ${tx.recipient}` : `From: ${tx.sender}`}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{tx.date}</p>
                        <p className="text-sm text-muted-foreground">{index % 2 === 0 ? "Confirmed" : "Pending"}</p>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )
      case "settings":
        return (
          <div className="space-y-8">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 p-8 text-white shadow-lg">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl"></div>
              <h1 className="mb-2 text-3xl font-bold">Settings</h1>
              <p className="mb-4 max-w-lg text-white/80">Configure your inheritance protocol settings.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="overflow-hidden border-none bg-gradient-to-br from-slate-50 to-slate-100 shadow-md dark:from-slate-950/30 dark:to-slate-900/30">
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
                      <div className="flex items-center gap-4">
                        <Input
                          id="inactivityThreshold"
                          type="number"
                          value={inactivityThreshold}
                          onChange={(e) => setInactivityThreshold(Number(e.target.value))}
                          className="max-w-[180px]"
                        />
                        <span className="text-sm text-muted-foreground">days</span>
                      </div>
                    </div>
                    <div className="rounded-lg bg-muted p-4">
                      <p className="text-sm">
                        Set the number of days of inactivity before inheritance protocol is triggered. Current setting:{" "}
                        <span className="font-semibold">{inactivityThreshold} days</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                      <p className="text-sm">
                        Last activity:{" "}
                        <span className="font-medium">{new Date(lastActiveTimestamp).toLocaleDateString()}</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Settings</Button>
                </CardFooter>
              </Card>

              <Card className="overflow-hidden border-none bg-gradient-to-br from-slate-50 to-slate-100 shadow-md dark:from-slate-950/30 dark:to-slate-900/30">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Configure additional security options</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                      </div>
                      <Button variant="outline">Enable</Button>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">Get notified about important events</p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        <Sidebar className="border-r-0 bg-white/80 backdrop-blur-xl dark:bg-slate-950/80">
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Next of Kin
              </h2>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveTab("dashboard")}
                  isActive={activeTab === "dashboard"}
                  className={
                    activeTab === "dashboard"
                      ? "bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30"
                      : ""
                  }
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveTab("beneficiaries")}
                  isActive={activeTab === "beneficiaries"}
                  className={
                    activeTab === "beneficiaries"
                      ? "bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30"
                      : ""
                  }
                >
                  <Users className="mr-2 h-4 w-4" />
                  <span>Beneficiaries</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveTab("transactions")}
                  isActive={activeTab === "transactions"}
                  className={
                    activeTab === "transactions"
                      ? "bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30"
                      : ""
                  }
                >
                  <History className="mr-2 h-4 w-4" />
                  <span>Transactions</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setActiveTab("settings")}
                  isActive={activeTab === "settings"}
                  className={
                    activeTab === "settings"
                      ? "bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30"
                      : ""
                  }
                >
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4">
            {userAddress ? (
              <div className="rounded-xl bg-gradient-to-r from-slate-100 to-slate-200 p-4 dark:from-slate-800 dark:to-slate-700">
                <div className="flex items-center space-x-4">
                  <Avatar className="ring-2 ring-purple-500 ring-offset-2 ring-offset-background">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                      {userAddress.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setUserAddress(null)}
                      className="mt-1 h-7 px-2 text-xs"
                    >
                      <LogOut className="mr-1 h-3 w-3" />
                      Disconnect
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <Button
                onClick={handleConnect}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
              >
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center text-amber-600 dark:text-amber-500">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Inactivity Detected
            </DialogTitle>
            <DialogDescription>
              You have been inactive for more than {inactivityThreshold} days. Your assets may be at risk of being
              transferred to your designated beneficiaries.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-900/20">
            <p className="text-sm text-amber-800 dark:text-amber-300">
              To prevent automatic asset distribution, please confirm your activity by clicking the button below.
            </p>
          </div>
          <DialogFooter className="mt-4">
            <Button
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
              onClick={() => {
                setIsInactivityWarningVisible(false)
                updateLastActiveTimestamp()
              }}
            >
              I'm Active
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}

