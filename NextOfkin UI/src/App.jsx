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
