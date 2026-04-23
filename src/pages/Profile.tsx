import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { User as UserIcon, Mail, LogOut, Shield, Bell, Save, ArrowLeft } from 'lucide-react';

interface ProfileRow {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('market');
  const [notifyMarket, setNotifyMarket] = useState(true);
  const [notifyIPO, setNotifyIPO] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (!u) navigate('/login');
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const u = session?.user ?? null;
      setUser(u);
      if (!u) {
        navigate('/login');
        return;
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', u.id)
        .maybeSingle();
      if (!error && data) {
        setProfile(data as ProfileRow);
        setDisplayName(data.display_name ?? '');
      }
      // load preferences
      const stored = localStorage.getItem(`prefs:${u.id}`);
      if (stored) {
        try {
          const p = JSON.parse(stored);
          if (typeof p.notifyMarket === 'boolean') setNotifyMarket(p.notifyMarket);
          if (typeof p.notifyIPO === 'boolean') setNotifyIPO(p.notifyIPO);
        } catch {}
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ display_name: displayName.trim() || null, updated_at: new Date().toISOString() })
      .eq('id', user.id);
    if (error) {
      toast({ title: 'Save failed', description: error.message, variant: 'destructive' });
    } else {
      localStorage.setItem(`prefs:${user.id}`, JSON.stringify({ notifyMarket, notifyIPO }));
      toast({ title: 'Profile updated', description: 'Your changes have been saved.' });
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: 'Sign out failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Signed out', description: 'See you again soon!' });
      navigate('/');
    }
  };

  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';

  const initials = (displayName || user?.email || '?')
    .split(/[\s@]/)[0]
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <Navbar activeTab={activeTab} onTabChange={(t) => { setActiveTab(t); navigate('/'); }} />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to dashboard
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="bg-surface-1 border border-border rounded-xl p-6 card-hover tilt-3d">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-bullish/20 border-2 border-bullish/40 flex items-center justify-center glow-green">
                <span className="text-bullish font-bold text-xl font-mono">{initials}</span>
              </div>
              <div className="min-w-0 flex-1">
                {loading ? (
                  <>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-64" />
                  </>
                ) : (
                  <>
                    <h1 className="text-xl font-bold text-foreground truncate">
                      {displayName || user?.email?.split('@')[0] || 'Trader'}
                    </h1>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> {user?.email}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-0.5">Member since {memberSince}</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Account info */}
          <Card className="bg-surface-1 border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-bullish" /> Account
              </CardTitle>
              <CardDescription>Manage your display name and basic account info.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={user?.email ?? ''} disabled className="font-mono text-sm" />
                <p className="text-[11px] text-muted-foreground">Email is your login identifier and can't be changed here.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayName">Display name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="How should we address you?"
                  disabled={loading || saving}
                />
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="bg-surface-1 border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bell className="w-4 h-4 text-gold" /> Preferences
              </CardTitle>
              <CardDescription>Choose what updates you'd like to see.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <label className="flex items-center justify-between gap-4 p-3 rounded-lg bg-surface-2 border border-border cursor-pointer hover:border-bullish/30 transition-colors">
                <div>
                  <p className="text-sm font-medium text-foreground">Market alerts</p>
                  <p className="text-xs text-muted-foreground">Get notified about big index movements during market hours.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyMarket}
                  onChange={(e) => setNotifyMarket(e.target.checked)}
                  className="w-4 h-4 accent-bullish"
                />
              </label>
              <label className="flex items-center justify-between gap-4 p-3 rounded-lg bg-surface-2 border border-border cursor-pointer hover:border-bullish/30 transition-colors">
                <div>
                  <p className="text-sm font-medium text-foreground">IPO updates</p>
                  <p className="text-xs text-muted-foreground">New IPO openings, GMP changes and listing day results.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifyIPO}
                  onChange={(e) => setNotifyIPO(e.target.checked)}
                  className="w-4 h-4 accent-bullish"
                />
              </label>
              <p className="text-[11px] text-muted-foreground pt-1">
                Preferences are stored locally for now. We'll sync them to your account in a future update.
              </p>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="bg-surface-1 border-border">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-4 h-4 text-bullish" /> Security
              </CardTitle>
              <CardDescription>Manage your password and session.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link
                to="/forgot-password"
                className="block text-sm text-primary hover:underline"
              >
                Change password →
              </Link>
            </CardContent>
          </Card>

          {/* Action bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="border-bearish/40 text-bearish hover:bg-bearish-bg hover:text-bearish"
            >
              <LogOut className="w-4 h-4 mr-2" /> Sign out
            </Button>
            <Button onClick={handleSave} disabled={saving || loading} className="bg-bullish hover:bg-bullish/90 text-primary-foreground">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
