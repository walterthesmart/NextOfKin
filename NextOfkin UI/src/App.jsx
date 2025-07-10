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
  Clock,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  RefreshCw
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

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
  const [pulseAnimation, setPulseAnimation] = useState(false)

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
        
        // Trigger success animation
        setPulseAnimation(true)
        setTimeout(() => setPulseAnimation(false), 2000)
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
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 p-8 text-white shadow-xl">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h1 className="mb-2 text-4xl font-extrabold tracking-tight">Welcome to Next of Kin</h1>
                <p className="mb-6 max-w-lg text-white/90 text-lg">
                  Secure your digital legacy with our blockchain-powered inheritance solution.
                </p>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="border-white/20 bg-white/20 backdrop-blur-sm text-white px-4 py-1 text-sm">
                    <Sparkles className="h-3.5 w-3.5 mr-1" /> Stacks Blockchain
                  </Badge>
                  <Badge variant="outline" className="border-white/20 bg-white/20 backdrop-blur-sm text-white px-4 py-1 text-sm">
                    <Shield className="h-3.5 w-3.5 mr-1" /> Secure Inheritance
                  </Badge>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="overflow-hidden border-none bg-gradient-to-br from-violet-50 to-violet-100 shadow-lg hover:shadow-xl transition-all dark:from-violet-950/40 dark:to-violet-900/40 group">
                  <CardHeader className="bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 pb-8 pt-6 text-white">
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      STX Balance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="-mt-6 rounded-t-xl bg-card px-6 py-4">
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <div className="flex items-end justify-between">
                        <div className="text-4xl font-extrabold bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">{assets.stx}</div>
                        <div className="text-sm font-medium text-muted-foreground">STX</div>
                      </div>
                      <Progress
                        value={65}
                        className="mt-4 h-2 bg-violet-100 dark:bg-violet-900/30"
                        indicatorClassName="bg-gradient-to-r from-violet-500 to-fuchsia-500"
                      />
                    </motion.div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-none bg-gradient-to-br from-pink-50 to-pink-100 shadow-lg hover:shadow-xl transition-all dark:from-pink-950/40 dark:to-pink-900/40 group">
                  <CardHeader className="bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 pb-8 pt-6 text-white">
                    <CardTitle className="flex items-center gap-2">
                      <Coins className="h-5 w-5" />
                      Tokens
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="-mt-6 rounded-t-xl bg-card px-6 py-4">
                    <div className="space-y-3">
                      {assets.fungibleTokens.map((token, index) => (
                        <motion.div 
                          key={index} 
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-pink-100/50 dark:hover:bg-pink-900/20 transition-colors"
                          whileHover={{ x: 5 }}
                        >
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: token.color }}>
                              <Coins className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-medium">{token.name}</span>
                          </div>
                          <span className="font-bold text-lg">{token.balance}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden border-none bg-gradient-to-br from-blue-50 to-cyan-100 shadow-lg hover:shadow-xl transition-all dark:from-blue-950/40 dark:to-cyan-900/40 group">
                  <CardHeader className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 pb-8 pt-6 text-white">
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="h-5 w-5" />
                      NFTs
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="-mt-6 rounded-t-xl bg-card px-6 py-4">
                    <div className="grid grid-cols-2 gap-3">
                      {assets.nfts.map((nft, index) => (
                        <motion.div 
                          key={index} 
                          className="overflow-hidden rounded-lg border bg-background p-2 hover:border-blue-300 dark:hover:border-blue-500 transition-all"
                          whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3)" }}
                        >
                          <img
                            src={nft.image || "/placeholder.svg"}
                            alt={nft.name}
                            className="mb-2 aspect-square w-full rounded-md object-cover"
                          />
                          <p className="text-center text-sm font-medium">{nft.name}</p>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="overflow-hidden border-none bg-gradient-to-br from-slate-50 to-slate-100 shadow-lg dark:from-slate-900/60 dark:to-slate-800/60 backdrop-blur-sm">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
                    <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                      <RefreshCw className="h-3.5 w-3.5" />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[250px]">
                    {transactions.slice(0, 3).map((tx, index) => (
                      <motion.div 
                        key={index} 
                        className="flex items-center justify-between border-b p-4 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                        whileHover={{ backgroundColor: "rgba(241, 245, 249, 0.5)" }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-12 w-12 items-center justify-center rounded-full ${
                              tx.type === "send" 
                                ? "bg-gradient-to-r from-rose-500 to-red-500 text-white" 
                                : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                            }`}
                          >
                            {tx.type === "send" ? <ArrowUp className="h-5 w-5" /> : <ArrowDown className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className="font-semibold text-base">
                              {tx.type === "send" ? "Sent" : "Received"} {tx.amount}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {tx.type === "send" ? `To: ${tx.recipient}` : `From: ${tx.sender}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <p className="text-sm text-muted-foreground">{tx.date}</p>
                          <Badge variant="outline" className="mt-1">
                            {index % 2 === 0 ? 
                              <><CheckCircle2 className="h-3 w-3 mr-1 text-emerald-500" /> Confirmed</> : 
                              <><Clock className="h-3 w-3 mr-1 text-amber-500" /> Pending</>
                            }
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </ScrollArea>
                </CardContent>
                <CardFooter className="border-t p-4">
                  <Button variant="outline" className="w-full" onClick={() => setActiveTab("transactions")}>
                    View All Transactions
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        )
      case "beneficiaries":
        return (
          <div className="space-y-8">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 p-8 text-white shadow-xl">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h1 className="mb-2 text-4xl font-extrabold tracking-tight">Beneficiaries</h1>
                <p className="mb-6 max-w-lg text-white/90 text-lg">
                  Manage who will inherit your digital assets and set distribution rules.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="overflow-hidden border-none bg-gradient-to-br from-slate-50 to-slate-100 shadow-lg dark:from-slate-900/60 dark:to-slate-800/60 backdrop-blur-sm">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl font-bold">Your Beneficiaries</CardTitle>
                      <CardDescription>Manage your beneficiaries and their allocation percentages</CardDescription>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Beneficiary
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Add New Beneficiary</DialogTitle>
                          <DialogDescription>Enter the details of the new beneficiary.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" placeholder="Name" className="border-indigo-200 focus-visible:ring-indigo-500" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="address">Stacks Address</Label>
                            <Input id="address" placeholder="Stacks Address" className="border-indigo-200 focus-visible:ring-indigo-500" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="share">Share (%)</Label>
                            <Input id="share" placeholder="Share (%)" className="border-indigo-200 focus-visible:ring-indigo-500" />
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
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 w-full"
                          >
                            Add Beneficiary
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    {beneficiaries.map((beneficiary, index) => (
                      <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className="group relative overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md"
                      >
                        <div
                          className="absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-20"
                          style={{ backgroundColor: beneficiary.color }}
                        ></div>
                        <div className="relative z-10 flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ backgroundColor: beneficiary.color }}>
                                <span className="text-white font-bold">{beneficiary.name.slice(0, 1)}</span>
                              </div>
                              <h3 className="text-xl font-bold">{beneficiary.name}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground font-mono">{beneficiary.address}</p>
                            <Badge variant="outline" className="mt-2 border-2" style={{ borderColor: `${beneficiary.color}30`, color: beneficiary.color }}>
                              Share: {beneficiary.share}
                            </Badge>
                          </div>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="icon"
                                  className="opacity-0 transition-opacity group-hover:opacity-100"
                                  onClick={() => handleRemoveBeneficiary(beneficiary.address)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Remove Beneficiary</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </motion.div>
                    ))}

                    <Dialog>
                      <DialogTrigger asChild>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed bg-muted/50 p-6 text-muted-foreground transition-colors hover:bg-muted"
                          onClick={() => setIsAddingBeneficiary(true)}
                        >
                          <div className="mb-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 p-2 text-white">
                            <Plus className="h-6 w-6" />
                          </div>
                          <p className="font-medium">Add New Beneficiary</p>
                        </motion.div>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Add New Beneficiary</DialogTitle>
                          <DialogDescription>Enter the details of the new beneficiary.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="name2">Name</Label>
                            <Input id="name2" placeholder="Name" className="border-indigo-200 focus-visible:ring-indigo-500" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="address2">Stacks Address</Label>
                            <Input id="address2" placeholder="Stacks Address" className="border-indigo-200 focus-visible:ring-indigo-500" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="share2">Share (%)</Label>
                            <Input id="share2" placeholder="Share (%)" className="border-indigo-200 focus-visible:ring-indigo-500" />
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
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 w-full"
                          >
                            Add Beneficiary
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="overflow-hidden border-none bg-gradient-to-br from-amber-50 to-amber-100 shadow-lg dark:from-amber-950/40 dark:to-amber-900/40">
                <CardHeader className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 pb-6 pt-6 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Inheritance Rules
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <p>
                      Your assets will be distributed to your beneficiaries if you remain inactive for{" "}
                      <span className="font-bold text-amber-700 dark:text-amber-400">{inactivityThreshold} days</span>. Make sure to log in regularly to prevent automatic asset distribution.
                    </p>
                    <div className="rounded-lg bg-gradient-to-r from-amber-100/80 to-amber-50/80 p-4 dark:from-amber-900/50 dark:to-amber-800/30 border border-amber-200 dark:border-amber-700/50">
                      <h4 className="mb-3 font-bold text-amber-800 dark:text-amber-300 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Current Distribution Plan
                      </h4>
                      <div className="space-y-3">
                        {beneficiaries.map((beneficiary, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="h-6 w-6 rounded-full" style={{ backgroundColor: beneficiary.color }}></div>
                              <span className="font-medium">{beneficiary.name}</span>
                            </div>
                            <span className="font-bold" style={{ color: beneficiary.color }}>
                              {beneficiary.share}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4 bg-amber-50/50 dark:bg-amber-900/20">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                      <p className="text-sm">
                        Last activity:{" "}
                        <span className="font-medium">{new Date(lastActiveTimestamp).toLocaleDateString()}</span>
                      </p>
                    </div>
                    <Button variant="outline" className="bg-white/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/30 hover:bg-amber-100/80 dark:hover:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                      <Clock className="h-4 w-4 mr-2" /> Adjust Timing
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        )
      case "transactions":
        return (
          <div className="space-y-8">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 p-8 text-white shadow-xl">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h1 className="mb-2 text-4xl font-extrabold tracking-tight">Transaction History</h1>
                <p className="mb-6 max-w-lg text-white/90 text-lg">
                  View all your blockchain transactions and activity history.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="w-full mb-6 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900/60 dark:to-slate-800/60 border border-slate-200 dark:border-slate-800 p-1 rounded-lg">
                  <TabsTrigger value="all" className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm rounded-md">All</TabsTrigger>
                  <TabsTrigger value="sent" className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm rounded-md">Sent</TabsTrigger>
                  <TabsTrigger value="received" className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800 data-[state=active]:shadow-sm rounded-md">Received</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <Card className="overflow-hidden border-none bg-gradient-to-br from-slate-50 to-slate-100 shadow-lg dark:from-slate-900/60 dark:to-slate-800/60 backdrop-blur-sm">
                    <CardHeader className="border-b">
                      <CardTitle className="flex items-center justify-between">
                        <span>All Transactions</span>
                        <Badge variant="outline" className="px-4 py-1 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30 text-blue-600 dark:text-blue-400">
                          {transactions.length} Transactions
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ScrollArea className="h-[500px]">
                        {transactions.map((tx, index) => (
                          <motion.div 
                            key={index} 
                            className="flex items-center justify-between border-b p-6 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                            whileHover={{ backgroundColor: "rgba(241, 245, 249, 0.5)" }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`flex h-14 w-14 items-center justify-center rounded-full ${
                                  tx.type === "send" 
                                    ? "bg-gradient-to-r from-rose-500 to-red-500 text-white" 
                                    : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
                                }`}
                              >
                                {tx.type === "send" ? <ArrowUp className="h-6 w-6" /> : <ArrowDown className="h-6 w-6" />}
                              </div>
                              <div>
                                <p className="text-lg font-bold">
                                  {tx.type === "send" ? "Sent" : "Received"} {tx.amount}
                                </p>
                                <p className="text-sm text-muted-foreground font-mono">
                                  {tx.type === "send" ? `To: ${tx.recipient}` : `From: ${tx.sender}`}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{tx.date}</p>
                              <Badge variant="outline" className="mt-1">
                                {index % 2 === 0 ? 
                                  <><CheckCircle2 className="h-3 w-3 mr-1 text-emerald-500" /> Confirmed</> : 
                                  <><Clock className="h-3 w-3 mr-1 text-amber-500" /> Pending</>
                                }
                              </Badge>
                            </div>
                          </motion.div>
                        ))}
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="sent">
                  <Card className="overflow-hidden border-none bg-gradient-to-br from-slate-50 to-slate-100 shadow-lg dark:from-slate-900/60 dark:to-slate-800/60 backdrop-blur-sm">
                    <CardHeader className="border-b">
                      <CardTitle className="flex items-center justify-between">
                        <span>Sent Transactions</span>
                        <Badge variant="outline" className="px-4 py-1 bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/30 text-rose-600 dark:text-rose-400">
                          {transactions.filter(tx => tx.type === "send").length} Transactions
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ScrollArea className="h-[500px]">
                        {transactions.filter(tx => tx.type === "send").map((tx, index) => (
                          <motion.div 
                            key={index} 
                            className="flex items-center justify-between border-b p-6 last:border-0 hover:bg-rose-50/30 dark:hover:bg-rose-900/10 transition-colors"
                            whileHover={{ backgroundColor: "rgba(254, 226, 226, 0.2)" }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-rose-500 to-red-500 text-white">
                                <ArrowUp className="h-6 w-6" />
                              </div>
                              <div>
                                <p className="text-lg font-bold">
                                  Sent {tx.amount}
                                </p>
                                <p className="text-sm text-muted-foreground font-mono">
                                  To: {tx.recipient}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{tx.date}</p>
                              <Badge variant="outline" className="mt-1">
                                {index % 2 === 0 ? 
                                  <><CheckCircle2 className="h-3 w-3 mr-1 text-emerald-500" /> Confirmed</> : 
                                  <><Clock className="h-3 w-3 mr-1 text-amber-500" /> Pending</>
                                }
                              </Badge>
                            </div>
                          </motion.div>
                        ))}
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="received">
                  <Card className="overflow-hidden border-none bg-gradient-to-br from-slate-50 to-slate-100 shadow-lg dark:from-slate-900/60 dark:to-slate-800/60 backdrop-blur-sm">
                    <CardHeader className="border-b">
                      <CardTitle className="flex items-center justify-between">
                        <span>Received Transactions</span>
                        <Badge variant="outline" className="px-4 py-1 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/30 text-emerald-600 dark:text-emerald-400">
                          {transactions.filter(tx => tx.type === "receive").length} Transactions
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <ScrollArea className="h-[500px]">
                        {transactions.filter(tx => tx.type === "receive").map((tx, index) => (
                          <motion.div 
                            key={index} 
                            className="flex items-center justify-between border-b p-6 last:border-0 hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors"
                            whileHover={{ backgroundColor: "rgba(220, 252, 231, 0.2)" }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                                <ArrowDown className="h-6 w-6" />
                              </div>
                              <div>
                                <p className="text-lg font-bold">
                                  Received {tx.amount}
                                </p>
                                <p className="text-sm text-muted-foreground font-mono">
                                  From: {tx.sender}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{tx.date}</p>
                              <Badge variant="outline" className="mt-1">
                                {index % 2 === 0 ? 
                                  <><CheckCircle2 className="h-3 w-3 mr-1 text-emerald-500" /> Confirmed</> : 
                                  <><Clock className="h-3 w-3 mr-1 text-amber-500" /> Pending</>
                                }
                              </Badge>
                            </div>
                          </motion.div>
                        ))}
                      </ScrollArea>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        )
      case "settings":
        return (
          <div className="space-y-8">
            <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white shadow-xl">
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h1 className="mb-2 text-4xl font-extrabold tracking-tight">Settings</h1>
                <p className="mb-6 max-w-lg text-white/90 text-lg">
                  Configure your inheritance protocol settings and security preferences.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="overflow-hidden border-none bg-gradient-to-br from-slate-50 to-slate-100 shadow-lg dark:from-slate-900/60 dark:to-slate-800/60 backdrop-blur-sm">
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Clock className="h-5 w-5 text-emerald-500" />
                      Inactivity Settings
                    </CardTitle>
                    <CardDescription>Configure the inactivity threshold for inheritance protocol</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="inactivityThreshold" className="text-sm font-medium">
                          Inactivity Threshold (Days)
                        </Label>
                        <div className="flex items-center gap-4">
                          <Input
                            id="inactivityThreshold"
                            type="number"
                            value={inactivityThreshold}
                            onChange={(e) => setInactivityThreshold(Number(e.target.value))}
                            className="max-w-[180px] border-emerald-200 focus-visible:ring-emerald-500"
                          />
                          <span className="text-sm font-medium text-muted-foreground">days</span>
                        </div>
                      </div>
                      <div className="rounded-lg bg-gradient-to-r from-emerald-50 to-emerald-100/50 p-4 border border-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/10 dark:border-emerald-800/30">
                        <p className="text-sm text-emerald-800 dark:text-emerald-300 flex items-start">
                          <AlertTriangle className="h-4 w-4 mr-2 mt-0.5 text-emerald-500" />
                          <span>
                            Set the number of days of inactivity before inheritance protocol is triggered. Current setting:{" "}
                            <span className="font-bold">{inactivityThreshold} days</span>
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                        <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                        <p className="text-sm">
                          Last activity:{" "}
                          <span className="font-bold">{new Date(lastActiveTimestamp).toLocaleDateString()}</span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t p-4 bg-gradient-to-r from-slate-50 to-slate-100/50 dark:from-slate-900/40 dark:to-slate-800/40">
                    <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700">
                      Save Settings
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="overflow-hidden border-none bg-gradient-to-br from-slate-50 to-slate-100 shadow-lg dark:from-slate-900/60 dark:to-slate-800/60 backdrop-blur-sm">
                  <CardHeader className="border-b">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Shield className="h-5 w-5 text-indigo-500" />
                      Security Settings
                    </CardTitle>
                    <CardDescription>Configure additional security options for your account</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <motion.div 
                        className="flex items-center justify-between rounded-lg border border-indigo-100 dark:border-indigo-800/30 p-4 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all"
                        whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(79, 70, 229, 0.1)" }}
                      >
                        <div>
                          <p className="font-bold text-indigo-800 dark:text-indigo-300">Two-Factor Authentication</p>
                          <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                        </div>
                        <Button variant="outline" className="border-indigo-200 dark:border-indigo-800/30 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                          Enable
                        </Button>
                      </motion.div>
                      
                      <motion.div 
                        className="flex items-center justify-between rounded-lg border border-indigo-100 dark:border-indigo-800/30 p-4 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all"
                        whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(79, 70, 229, 0.1)" }}
                      >
                        <div>
                          <p className="font-bold text-indigo-800 dark:text-indigo-300">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">Get notified about important events and activity</p>
                        </div>
                        <Button variant="outline" className="border-indigo-200 dark:border-indigo-800/30 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                          Configure
                        </Button>
                      </motion.div>
                      
                      <motion.div 
                        className="flex items-center justify-between rounded-lg border border-indigo-100 dark:border-indigo-800/30 p-4 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 transition-all"
                        whileHover={{ scale: 1.01, boxShadow: "0 4px 12px rgba(79, 70, 229, 0.1)" }}
                      >
                        <div>
                          <p className="font-bold text-indigo-800 dark:text-indigo-300">Recovery Options</p>
                          <p className="text-sm text-muted-foreground">Configure backup methods for account recovery</p>
                        </div>
                        <Button variant="outline" className="border-indigo-200 dark:border-indigo-800/30 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                          Setup
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="overflow-hidden border-none bg-gradient-to-br from-slate-50 to-slate-100 shadow-lg dark:from-slate-900/60 dark:to-slate-800/60 backdrop-blur-sm">
                <CardHeader className="border-b">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    Danger Zone
                  </CardTitle>
                  <CardDescription>Critical account actions that should be used with caution</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="rounded-lg border border-red-200 dark:border-red-900/30 p-5 bg-red-50/50 dark:bg-red-950/20">
                      <h4 className="text-lg font-bold mb-2 text-red-700 dark:text-red-400">Reset Inheritance Protocol</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        This action will remove all beneficiaries and reset your inheritance settings. This cannot be undone.
                      </p>
                      <Button variant="destructive" className="w-full bg-red-600 hover:bg-red-700">Reset Inheritance Settings</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
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
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 text-white shadow-lg">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-extrabold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent">
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
                      ? "bg-gradient-to-r from-violet-100 to-pink-100 dark:from-violet-900/30 dark:to-pink-900/30"
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
                      ? "bg-gradient-to-r from-indigo-100 to-violet-100 dark:from-indigo-900/30 dark:to-violet-900/30"
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
              <motion.div
                className="rounded-xl bg-gradient-to-r from-slate-100 to-slate-200 p-4 dark:from-slate-800 dark:to-slate-700 shadow-sm hover:shadow-md transition-all"
                animate={pulseAnimation ? {
                  boxShadow: ["0 0 0 0 rgba(124, 58, 237, 0)", "0 0 0 10px rgba(124, 58, 237, 0.2)", "0 0 0 20px rgba(124, 58, 237, 0)"],
                } : {}}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="ring-2 ring-violet-500 ring-offset-2 ring-offset-background">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                    <AvatarFallback className="bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 text-white">
                      {userAddress.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold text-violet-800 dark:text-violet-300">
                      {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setUserAddress(null)}
                      className="mt-1 h-7 px-2 text-xs text-violet-600 hover:text-violet-700 hover:bg-violet-100 dark:text-violet-400 dark:hover:bg-violet-900/30"
                    >
                      <LogOut className="mr-1 h-3 w-3" />
                      Disconnect
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <Button
                onClick={handleConnect}
                className="w-full bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 text-white hover:from-violet-700 hover:via-fuchsia-700 hover:to-pink-700 shadow-md hover:shadow-lg transition-all"
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
        <DialogContent className="sm:max-w-md border-none bg-white/90 backdrop-blur-xl dark:bg-slate-900/90 shadow-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center text-amber-600 dark:text-amber-500 text-xl">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Inactivity Detected
            </DialogTitle>
            <DialogDescription>
              You have been inactive for more than {inactivityThreshold} days. Your assets may be at risk of being
              transferred to your designated beneficiaries.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-gradient-to-r from-amber-50 to-amber-100/50 p-4 border border-amber-200 dark:from-amber-900/30 dark:to-amber-800/20 dark:border-amber-800/30">
            <p className="text-sm text-amber-800 dark:text-amber-300 flex items-start">
              <AlertTriangle className="h-4 w-4 mr-2 mt-0.5" />
              <span>
                To prevent automatic asset distribution, please confirm your activity by clicking the button below.
              </span>
            </p>
          </div>
          <DialogFooter className="mt-4">
            <Button
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-md"
              onClick={() => {
                setIsInactivityWarningVisible(false)
                updateLastActiveTimestamp()
              }}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" /> Confirm I'm Active
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}