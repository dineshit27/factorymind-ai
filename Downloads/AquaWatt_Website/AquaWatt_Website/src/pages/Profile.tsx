import React, { useState, useEffect, useRef } from "react";
// Switched to Supabase auth provider; alias as useAuth for minimal downstream changes
import { useSupabaseAuth as useAuth } from "../contexts/SupabaseAuthContext";
import { useToast } from "../hooks/use-toast";
import { useLanguage } from "../contexts/LanguageContext";
import { DashboardHeader } from "../components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import {
  User,
  Settings,
  Bell,
  Shield,
  Smartphone,
  Users,
  Save,
  Camera,
  Upload,
  Trash2,
  Mail,
  MapPin,
  Globe,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Plus,
  TrendingUp,
  Droplet,
  Zap,
  Award,
  CheckCircle,
  AlertCircle,
  Info,
  Activity
} from "lucide-react";
import { LogOut } from "lucide-react";
import { DevicesPanel } from "@/components/DevicesPanel";
import { listFamilyMembers, inviteFamilyMember, removeFamilyMember, updateFamilyMember, FamilyMember, activatePendingFamilyMembership } from "@/services/familyMembers";
import { useNavigate } from "react-router-dom";
// Reuse existing facts & notes components inside profile tools tab
// Removed Tools tab (notes/facts) from Profile per requirements

// NOTE: This file has been refactored to avoid shadowing the LanguageContext value with a local state variable
// and to add stronger typing, URL object cleanup, and minor safety improvements.

const Profile: React.FC = () => {
  const { user, signOutUser } = useAuth();
  const { toast } = useToast();
  const { language: appLanguage, setLanguage: setAppLanguage } = useLanguage();
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const previousAvatarUrl = useRef<string | null>(null);

  // --- Types ---------------------------------------------------------------
  type ThemePreference = "light" | "dark" | "system";
  type LanguageCode = "en" | "es" | "fr" | "de";
  type ProfileVisibility = "public" | "private" | "friends";

  // Storage keys
  const PREFS_KEY = "profile:prefs";
  const SECURITY_KEY = "profile:security";
  const FAMILY_KEY = "profile:family";
  const DEVICES_KEY = "profile:devices";

  // Basic profile state
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [location, setLocation] = useState("San Francisco, CA");
  const [website, setWebsite] = useState("https://waterlight-harmony.com");
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [preferencesLoading, setPreferencesLoading] = useState<boolean>(false);

  // Preferences state
  const [theme, setTheme] = useState<ThemePreference>("light");
  const [prefLanguage, setPrefLanguage] = useState<LanguageCode>((appLanguage as LanguageCode) || "en");
  const [timezone, setTimezone] = useState("America/Los_Angeles");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [dataSharing, setDataSharing] = useState(true);
  const [profileVisibility, setProfileVisibility] = useState<ProfileVisibility>("public");
  const [settingsId, setSettingsId] = useState<string | null>(null);

  // Security state
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Family members (Supabase-backed)
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [familyLoading, setFamilyLoading] = useState<boolean>(false);
  const [familyError, setFamilyError] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("viewer");
  const [inviting, setInviting] = useState<boolean>(false);

  // Mock data for advanced features
  const [usageStats] = useState({
    waterSaved: 1250,
    energySaved: 850,
    carbonReduced: 45,
    moneySaved: 320
  });

  const [monthlyGoals] = useState({
    water: { target: 2000, current: 1250, unit: "L" },
    energy: { target: 1500, current: 850, unit: "kWh" },
    carbon: { target: 100, current: 45, unit: "kg CO₂" }
  });

  const [recentActivity] = useState([
    { type: "achievement", message: "Achieved water saving goal!", time: "2 hours ago", icon: Award },
    { type: "update", message: "Profile updated successfully", time: "1 day ago", icon: CheckCircle },
    { type: "alert", message: "High water usage detected", time: "2 days ago", icon: AlertCircle },
    { type: "info", message: "Monthly report generated", time: "3 days ago", icon: Info }
  ]);

  const [connectedDevices, setConnectedDevices] = useState([
    { name: "Smart Water Meter", type: "water", status: "online", lastSeen: "Just now" },
    { name: "Energy Monitor Pro", type: "energy", status: "online", lastSeen: "5 minutes ago" },
    { name: "Garden Sprinkler", type: "irrigation", status: "offline", lastSeen: "2 hours ago" },
    { name: "Smart Thermostat", type: "climate", status: "online", lastSeen: "1 minute ago" }
  ]);

  // Reset scroll position on mount
  useEffect(() => {
    if (profileRef.current) profileRef.current.scrollTop = 0;
  }, []);

  // Supabase AuthUser does not have displayName; prefer user.user_metadata.full_name or fallback to email
  useEffect(() => {
    const fullName = (user as any)?.user_metadata?.full_name;
    if (fullName) setDisplayName(fullName);
  }, [user]);

  // Load persisted settings once (fallback only – replaced by Supabase fetch below)
  useEffect(() => {
    try {
      const prefsRaw = localStorage.getItem(PREFS_KEY);
      if (prefsRaw) {
        const p = JSON.parse(prefsRaw);
        if (p.theme) setTheme(p.theme as ThemePreference);
        if (p.language) setPrefLanguage(p.language as LanguageCode);
        if (p.timezone) setTimezone(p.timezone);
        setEmailNotifications(p.emailNotifications ?? true);
        setPushNotifications(p.pushNotifications ?? true);
        setSmsNotifications(p.smsNotifications ?? false);
        setMarketingEmails(p.marketingEmails ?? false);
        setDataSharing(p.dataSharing ?? true);
        if (p.profileVisibility) setProfileVisibility(p.profileVisibility as ProfileVisibility);
      }
      const secRaw = localStorage.getItem(SECURITY_KEY);
      if (secRaw) {
        const s = JSON.parse(secRaw);
        setTwoFactorEnabled(!!s.twoFactorEnabled);
      }
      // Legacy local family storage removed; now fetched from Supabase
      const devRaw = localStorage.getItem(DEVICES_KEY);
      if (devRaw) {
        const d = JSON.parse(devRaw);
        if (Array.isArray(d)) setConnectedDevices(d);
      }
    } catch {
      // ignore parsing errors
    }
  }, []);

  // Persist preferences locally only as cache (Supabase is source of truth)
  useEffect(() => {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify({
        theme,
        language: prefLanguage,
        timezone,
        emailNotifications,
        pushNotifications,
        smsNotifications,
        marketingEmails,
        dataSharing,
        profileVisibility
      }));
    } catch {/* ignore */}
  }, [theme, prefLanguage, timezone, emailNotifications, pushNotifications, smsNotifications, marketingEmails, dataSharing, profileVisibility]);

  // Persist security
  useEffect(() => {
    try {
      localStorage.setItem(SECURITY_KEY, JSON.stringify({ twoFactorEnabled }));
    } catch {/* ignore */}
  }, [twoFactorEnabled]);

  // Load family members from Supabase
  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setFamilyLoading(true);
      const { data, error } = await listFamilyMembers();
      if (error) setFamilyError(error); else setFamilyMembers(data || []);
      setFamilyLoading(false);
    };
    load();
  }, [user]);

  // Activate pending invitation if this logged-in user was invited (magic link flow)
  useEffect(() => {
    const activate = async () => {
      if (!user) return;
      const { updated, error } = await activatePendingFamilyMembership();
      if (!error && updated > 0) {
        // Refresh list to reflect active status
        const { data } = await listFamilyMembers();
        if (data) setFamilyMembers(data);
        toast({ title: 'Access Granted', description: 'Your family membership is now active.' });
      }
    };
    activate();
  }, [user]);

  // Persist devices
  useEffect(() => {
    try {
      localStorage.setItem(DEVICES_KEY, JSON.stringify(connectedDevices));
    } catch {/* ignore */}
  }, [connectedDevices]);

  // Apply theme (force light globally)
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
  }, [theme]);

  // Sync language preference with context
  useEffect(() => {
    if (prefLanguage && prefLanguage !== appLanguage) setAppLanguage(prefLanguage);
  }, [prefLanguage, appLanguage, setAppLanguage]);

  // Cleanup avatar object URLs
  useEffect(() => {
    return () => {
      if (previousAvatarUrl.current) URL.revokeObjectURL(previousAvatarUrl.current);
    };
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const payload: any = {
        id: user.id,
        email: user.email,
        full_name: displayName,
        display_name: displayName,
        avatar_url: avatarUrl || null,
        location: location || null,
        website: website || null,
        phone: null
      };

      // Prefer UPDATE first to avoid INSERT RLS on existing rows
      let updated = null as any;
      let err: any = null;
      try {
        const upd = await (supabase as any)
          .from('profiles')
          .update(payload)
          .eq('id', user.id)
          .select('*')
          .single();
        if (!upd.error) {
          updated = upd.data;
        } else {
          // If no row exists, PostgREST returns PGRST116/no rows; fall back to UPSERT
          err = upd.error;
        }
      } catch (e) {
        err = e;
      }

      if (!updated) {
        const up = await (supabase as any)
          .from('profiles')
          .upsert(payload, { onConflict: 'id' })
          .select('*')
          .single();
        if (up.error) throw up.error;
        updated = up.data;
      }

      toast({ title: 'Success!', description: 'Profile updated successfully' });
    } catch (err: any) {
      const msg: string = err?.message || '';
      const rlsHit = /row-level security/i.test(msg) && /profiles/i.test(msg);
      toast({
        title: 'Error',
        description: rlsHit
          ? 'Your project is missing the INSERT policy for profiles. Please apply the migration or add an INSERT policy: CREATE POLICY "insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);'
          : (msg || 'Failed to update profile'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setLoading(true);
    try {
      const objectUrl = URL.createObjectURL(file);
      if (previousAvatarUrl.current) URL.revokeObjectURL(previousAvatarUrl.current);
      previousAvatarUrl.current = objectUrl;
      setAvatarUrl(objectUrl);
      toast({ title: "Success!", description: "Profile picture uploaded successfully" });
    } catch {
      toast({ title: "Error", description: "Failed to upload profile picture", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({ title: "Error", description: "Password must be at least 6 characters long", variant: "destructive" });
      return;
    }
    setPasswordLoading(true);
    setTimeout(() => {
      setPasswordLoading(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast({ title: "Success!", description: "Password updated successfully" });
    }, 1000);
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      toast({ title: "Signed out", description: "Sign-out successful" });
      navigate("/");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      toast({ title: 'Sign out failed', description: message, variant: 'destructive' });
    }
  };

  const handleInvite = async () => {
    if (!newEmail.trim()) return;
    setInviting(true);
    // Map UI roles to DB accepted enum values
    const mappedRole = newRole === 'viewer' ? 'view' : newRole === 'editor' ? 'edit' : newRole;
    const { data, error } = await inviteFamilyMember(newEmail.trim(), mappedRole);
    if (error || !data) {
      toast({ title: "Error", description: error || "Failed to invite", variant: "destructive" });
    } else {
      setFamilyMembers(prev => [...prev, data]);
      setNewEmail("");
      toast({ title: "Invited", description: `Invitation sent to ${data.member_email}` });
    }
    setInviting(false);
  };

  const handleRemove = async (id: string) => {
    const { error } = await removeFamilyMember(id);
    if (error) {
      toast({ title: "Error", description: error, variant: "destructive" });
    } else {
      setFamilyMembers(prev => prev.filter(m => m.id !== id));
      toast({ title: "Removed", description: "Family member removed" });
    }
  };

  const handlePromote = async (member: FamilyMember, level: string) => {
    const { data, error } = await updateFamilyMember(member.id, { access_level: level });
    if (error || !data) {
      toast({ title: "Error", description: error || "Failed to update", variant: "destructive" });
    } else {
      setFamilyMembers(prev => prev.map(m => m.id === member.id ? data : m));
      toast({ title: "Updated", description: `${data.member_email} access set to ${data.access_level}` });
    }
  };

  const exportData = (type: 'profile' | 'usage') => {
    try {
      const payload: Record<string, unknown> = {
        generatedAt: new Date().toISOString(),
  user: { email: user?.email, displayName: displayName || (user as any)?.user_metadata?.full_name }
      };
      if (type === 'profile') {
        payload.profile = { displayName, location, website, avatarUrl };
        payload.preferences = {
          theme,
          language: prefLanguage,
          timezone,
            emailNotifications,
            pushNotifications,
            smsNotifications,
            marketingEmails,
            dataSharing,
            profileVisibility,
        };
      }
      if (type === 'usage') {
        payload.devices = connectedDevices;
        payload.goals = monthlyGoals;
        payload.stats = usageStats;
        payload.recentActivity = recentActivity;
  payload.family = familyMembers;
      }
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `aquawatt-${type}-export-${new Date().toISOString().slice(0,10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({ title: 'Export Complete', description: `${type} data downloaded as JSON` });
    } catch {
      toast({ title: 'Export Failed', description: 'Unable to export data', variant: 'destructive' });
    }
  };

  const addNewDevice = () => {
    const newDevice = { name: `Device ${connectedDevices.length + 1}` , type: 'custom', status: 'online', lastSeen: 'Just now' } as const;
    setConnectedDevices([newDevice, ...connectedDevices]);
    toast({ title: 'Device Added', description: `${newDevice.name} connected` });
  };

  // Fetch profile + settings from Supabase
  useEffect(() => {
    const fetchProfileAndSettings = async () => {
      if (!user) return;
      setProfileLoading(true);
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        const { data: profileData, error: profileErr } = await (supabase as any)
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (!profileErr && profileData) {
          setDisplayName(profileData.display_name || profileData.full_name || user.email || '');
          setAvatarUrl(profileData.avatar_url || '');
          setLocation(profileData.location || location);
          setWebsite(profileData.website || website);
        }
      } finally {
        setProfileLoading(false);
      }
    };
    fetchProfileAndSettings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    const fetchSettings = async () => {
      if (!user) return;
      setPreferencesLoading(true);
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        const { data: settingsData, error: settingsErr } = await (supabase as any)
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .single();
        if (!settingsErr && settingsData) {
          setSettingsId(settingsData.id);
          setTheme(settingsData.theme || theme);
        }
      } finally {
        setPreferencesLoading(false);
      }
    };
    fetchSettings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleSavePreferences = async () => {
    if (!user) return;
    setPreferencesLoading(true);
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const payload: any = {
        user_id: user.id,
        theme,
        notifications_enabled: emailNotifications || pushNotifications || smsNotifications,
      };
      const query = (supabase as any).from('user_settings');
      let result;
      if (settingsId) {
        result = await query.update(payload).eq('id', settingsId).select('*').single();
      } else {
        result = await query.upsert(payload).select('*').single();
      }
      if (result.error) throw result.error;
      if (!settingsId) setSettingsId(result.data.id);
      toast({ title: 'Saved', description: 'Preferences updated' });
    } catch (err: any) {
      toast({ title: 'Error', description: err?.message || 'Failed to save preferences', variant: 'destructive' });
    } finally {
      setPreferencesLoading(false);
    }
  };

  if (!user) return <div>Please log in to view your profile.</div>;

  return (
    <div className="flex min-h-screen bg-background flex-col">
      <main className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <div ref={profileRef} className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <div className="w-full overflow-x-auto">
              <TabsList className="grid w-full min-w-max grid-cols-6 gap-1 bg-muted p-1 rounded-lg">
                <TabsTrigger value="overview" className="flex items-center justify-center gap-2 text-xs sm:text-sm px-2 py-2 whitespace-nowrap">
                  <Activity className="h-4 w-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="profile" className="flex items-center justify-center gap-2 text-xs sm:text-sm px-2 py-2 whitespace-nowrap">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex items-center justify-center gap-2 text-xs sm:text-sm px-2 py-2 whitespace-nowrap">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Preferences</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center justify-center gap-2 text-xs sm:text-sm px-2 py-2 whitespace-nowrap">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Security</span>
                </TabsTrigger>
                <TabsTrigger value="devices" className="flex items-center justify-center gap-2 text-xs sm:text-sm px-2 py-2 whitespace-nowrap">
                  <Smartphone className="h-4 w-4" />
                  <span className="hidden sm:inline">Devices</span>
                </TabsTrigger>
                <TabsTrigger value="family" className="flex items-center justify-center gap-2 text-xs sm:text-sm px-2 py-2 whitespace-nowrap">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Family</span>
                </TabsTrigger>
                {/* Tools tab removed */}
              </TabsList>
            </div>

            <TabsContent value="overview" className="space-y-8">
              {/* User Summary */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start sm:justify-between text-center sm:text-left">
                    <CardTitle className="flex flex-col sm:flex-row items-center gap-4">
                      <Avatar className="h-16 w-16 sm:h-20 sm:w-20 ring-4 ring-primary/10">
                        <AvatarImage src={avatarUrl} />
                        <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {user.email?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-center sm:text-left">
                        <h2 className="text-xl sm:text-2xl font-bold">{displayName || user.email}</h2>
                        <div className="flex flex-col sm:flex-row items-center gap-2 mt-2">
                          <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium">
                            Premium User
                          </Badge>
                          <span className="text-sm text-muted-foreground">Member since Jan 2024</span>
                        </div>
                      </div>
                    </CardTitle>
                    <div className="flex items-center gap-2 self-center sm:self-auto">
                      <Button variant="outline" size="sm" onClick={handleSignOut} className="hidden sm:inline-flex">
                        <LogOut className="h-4 w-4 mr-2" /> Sign Out
                      </Button>
                      <Button variant="outline" size="icon" onClick={handleSignOut} className="sm:hidden">
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Usage Statistics Dashboard */}
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-xl flex-shrink-0">
                        <Droplet className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Water Saved</p>
                        <p className="text-2xl font-bold text-blue-600">{usageStats.waterSaved}L</p>
                        <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                          <TrendingUp className="h-4 w-4" />
                          <span>+12% this month</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-yellow-100 rounded-xl flex-shrink-0">
                        <Zap className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Energy Saved</p>
                        <p className="text-2xl font-bold text-yellow-600">{usageStats.energySaved} kWh</p>
                        <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
                          <TrendingUp className="h-4 w-4" />
                          <span>+8% this month</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-100 rounded-xl flex-shrink-0">
                        <Award className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium text-muted-foreground mb-1">Carbon Reduced</p>
                        <p className="text-xl sm:text-2xl font-bold">{usageStats.carbonReduced} kg</p>
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-green-600">
                          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>+15% this month</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="p-2 sm:p-3 bg-purple-100 rounded-full flex-shrink-0">
                        <span className="text-base sm:text-lg font-bold text-purple-600">$</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs sm:text-sm font-medium text-muted-foreground">Money Saved</p>
                        <p className="text-xl sm:text-2xl font-bold">${usageStats.moneySaved}</p>
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-green-600">
                          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>+20% this month</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Monthly Goals */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl font-bold">Monthly Goals</CardTitle>
                  <CardDescription>Track your progress towards sustainability goals</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {Object.entries(monthlyGoals).map(([key, goal]) => {
                    const percentage = Math.round((goal.current / goal.target) * 100);
                    return (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium capitalize">{key} Conservation</span>
                          <span className="text-sm text-muted-foreground">
                            {goal.current} / {goal.target} {goal.unit}
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                        <p className="text-xs text-muted-foreground text-right">{percentage}% of goal</p>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Recent Activity Feed */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
                  <CardDescription>Stay updated on your account and usage changes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-4">
                    {recentActivity.map((activity, index) => {
                      const IconComponent = activity.icon;
                      return (
                        <div key={index} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50">
                          <div className={`p-2 rounded-full ${
                            activity.type === 'achievement' ? 'bg-yellow-100 text-yellow-600' :
                            activity.type === 'update' ? 'bg-green-100 text-green-600' :
                            activity.type === 'alert' ? 'bg-red-100 text-red-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.message}</p>
                            <p className="text-xs text-muted-foreground">{activity.time}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-8">
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl font-bold">Personal Information</CardTitle>
                  <CardDescription>Update your personal details and profile picture</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                  {profileLoading && <div className="text-sm text-muted-foreground">Loading profile...</div>}
                  {/* Avatar Upload Section */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <div className="relative">
                      <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                        <AvatarImage src={avatarUrl} />
                        <AvatarFallback className="text-xl sm:text-2xl">
                          {user.email?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <Label 
                        htmlFor="avatar-upload" 
                        className="absolute -bottom-2 -right-2 cursor-pointer"
                      >
                        <div className="bg-primary rounded-full p-2 text-primary-foreground hover:bg-primary/90 transition-colors">
                          <Camera className="h-4 w-4" />
                        </div>
                      </Label>
                      <Input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </div>
                    <div className="text-center sm:text-left space-y-2">
                      <h3 className="text-lg font-semibold">Profile Picture</h3>
                      <p className="text-sm text-muted-foreground">
                        Upload a new avatar. JPG, PNG or GIF (max. 5MB)
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Label htmlFor="avatar-upload" className="cursor-pointer">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                          </Label>
                        </Button>
                        {avatarUrl && (
                          <Button variant="outline" size="sm" onClick={() => setAvatarUrl("")}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Personal Information Form */}
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            value={user.email || ""}
                            className="pl-10"
                            disabled
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="displayName"
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Enter your display name"
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="location"
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Enter your location"
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="website"
                            type="url"
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            placeholder="Enter your website"
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full">
                      {loading ? (
                        <>
                          <Save className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-8">
              {/* Theme & Appearance */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl font-bold">Theme & Appearance</CardTitle>
                  <CardDescription>Customize how the app looks and feels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select value={theme} onValueChange={(v) => setTheme(v as ThemePreference)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select value={prefLanguage} onValueChange={(v) => setPrefLanguage(v as LanguageCode)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Timezone</Label>
                      <Select value={timezone} onValueChange={setTimezone}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time</SelectItem>
                          <SelectItem value="America/Chicago">Central Time</SelectItem>
                          <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notifications */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-2 text-xl font-bold">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>Choose how you want to be notified</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>

                  <Separator />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive push notifications</p>
                    </div>
                    <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                  </div>

                  <Separator />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive text message alerts</p>
                    </div>
                    <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
                  </div>

                  <Separator />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-muted-foreground">Receive promotional content</p>
                    </div>
                    <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} />
                  </div>
                </CardContent>
              </Card>

              {/* Privacy */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl font-bold">Privacy Controls</CardTitle>
                  <CardDescription>Manage your privacy and data sharing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Profile Visibility</Label>
                    <Select value={profileVisibility} onValueChange={(v) => setProfileVisibility(v as ProfileVisibility)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                        <SelectItem value="friends">Friends Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <Label>Data Sharing</Label>
                      <p className="text-sm text-muted-foreground">Share usage data for analytics</p>
                    </div>
                    <Switch checked={dataSharing} onCheckedChange={setDataSharing} />
                  </div>
                </CardContent>
              </Card>

              {/* Data Export */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl font-bold">Data Export</CardTitle>
                  <CardDescription>Download your data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                    <Button variant="outline" onClick={() => exportData('profile')}>
                      Export Profile Data
                    </Button>
                    <Button variant="outline" onClick={() => exportData('usage')}>
                      Export Usage Data
                    </Button>
                  </div>
                  <div className="pt-2">
                    <Button disabled={preferencesLoading} onClick={handleSavePreferences} className="w-full">
                      {preferencesLoading ? 'Saving Preferences...' : 'Save Preferences'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-8">
              {/* Password Change */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-2 text-xl font-bold">
                    <Lock className="h-5 w-5" />
                    Change Password
                  </CardTitle>
                  <CardDescription>Update your account password for better security</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="current-password"
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>

                    <Alert>
                      <AlertDescription>
                        Password must be at least 6 characters long. Use a mix of letters, numbers, and symbols.
                      </AlertDescription>
                    </Alert>

                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
                    >
                      {passwordLoading ? (
                        <>
                          <Save className="mr-2 h-4 w-4 animate-spin" />
                          Updating Password...
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 h-4 w-4" />
                          Update Password
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Two-Factor Authentication */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-2 text-xl font-bold">
                    <Shield className="h-5 w-5" />
                    Two-Factor Authentication
                  </CardTitle>
                  <CardDescription>Add an extra layer of security to your account</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Enable 2FA</Label>
                      <p className="text-sm text-muted-foreground">
                        Use an authenticator app for additional security
                      </p>
                    </div>
                    <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                  </div>
                  {twoFactorEnabled && (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Two-factor authentication is enabled. Use your authenticator app to generate codes.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Account Information */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl font-bold">Account Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium">Email</span>
                      <span className="text-sm text-muted-foreground">{user.email}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium">Account Type</span>
                      <Badge variant="secondary">Premium</Badge>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium">Member Since</span>
                      <span className="text-sm text-muted-foreground">January 2024</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm font-medium">Last Login</span>
                      <span className="text-sm text-muted-foreground">Just now</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="devices" className="space-y-8">
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-2 text-xl font-bold">
                    <Smartphone className="h-5 w-5" />
                    Connected Devices
                  </CardTitle>
                  <CardDescription>Manage your smart home devices and sensors</CardDescription>
                </CardHeader>
                <CardContent>
                  <DevicesPanel />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="family" className="space-y-8">
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-2 text-xl font-bold">
                    <Users className="h-5 w-5" />
                    Family Member Access
                  </CardTitle>
                  <CardDescription>Share your utility data with family members</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {familyLoading && <div className="text-sm text-muted-foreground">Loading family members...</div>}
                  {familyError && <div className="text-sm text-red-600">{familyError}</div>}
                  {!familyLoading && !familyError && familyMembers.map((member) => (
                    <div key={member.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarFallback>
                            {member.member_email.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">{member.member_email}</p>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline" className="text-xs capitalize">
                              {(member.access_level || 'view').replace('viewer','view').replace('editor','edit')}
                            </Badge>
                            <Badge variant={member.status === 'active' ? 'default' : 'secondary'} className="text-xs capitalize">
                              {member.status || 'pending'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select value={member.access_level || 'view'} onValueChange={(v) => handlePromote(member, v)}>
                          <SelectTrigger className="w-[110px] h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="view">View</SelectItem>
                            <SelectItem value="edit">Edit</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleRemove(member.id)}
                                className="flex-shrink-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Remove access</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  ))}
                  {!familyLoading && !familyError && familyMembers.length === 0 && (
                    <div className="text-sm text-muted-foreground">No family members yet.</div>
                  )}
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Add Family Member</h4>
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                      <Input
                        placeholder="Email address"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                      />
                        <Select value={newRole} onValueChange={setNewRole}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="viewer">Viewer - Can view data only</SelectItem>
                          <SelectItem value="editor">Editor - Can view and edit settings</SelectItem>
                          <SelectItem value="admin">Admin - Full access</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleInvite} className="w-full" disabled={!newEmail.trim() || inviting}>
                      {inviting ? (
                        <>
                          <Save className="h-4 w-4 mr-2 animate-spin" /> Inviting...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" /> Send Invitation
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            {/* Tools content removed */}
          </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
