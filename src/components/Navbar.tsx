import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, ChevronDown, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'market', label: 'Market' },
  { id: 'nse', label: 'NSE Stocks' },
  { id: 'bse', label: 'BSE Stocks' },
  { id: 'ipo', label: 'IPO Hub' },
];

export const Navbar = ({ activeTab, onTabChange }: NavbarProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: 'Logout failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Signed out', description: 'See you again soon!' });
      navigate('/');
    }
  };
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-bullish rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground text-base tracking-tight">
              Stock<span className="text-bullish">Sense</span>
              <span className="text-[10px] font-mono text-muted-foreground ml-1.5 align-middle">AI</span>
            </span>
          </div>

          {/* Desktop Tabs */}
          <nav className="hidden sm:flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-bullish text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-surface-2'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Auth + Live badge */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-bullish-bg border border-bullish/30 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 bg-bullish rounded-full live-dot" />
              <span className="text-bullish text-xs font-medium">Market Open</span>
            </div>
            <Link to="/pricing" className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2">
              Pricing
            </Link>
            <Link to="/about" className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2">
              About
            </Link>
            <Link to="/contact" className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2">
              Contact
            </Link>
            {user ? (
              <div className="flex items-center gap-2 ml-1">
                <div className="flex items-center gap-1.5 bg-surface-2 border border-border px-2.5 py-1 rounded-full">
                  <div className="w-5 h-5 rounded-full bg-bullish/20 flex items-center justify-center">
                    <UserIcon className="w-3 h-3 text-bullish" />
                  </div>
                  <span className="text-xs text-foreground font-medium max-w-[140px] truncate">
                    {user.email}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-bearish transition-colors px-2"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors px-2">
                  <LogIn className="w-3.5 h-3.5" /> Login
                </Link>
                <Link to="/signup" className="text-xs font-medium bg-bullish text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-bullish/90 transition-colors">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            className="sm:hidden p-2 text-muted-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <ChevronDown className={`w-5 h-5 transition-transform ${mobileMenuOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <div className="sm:hidden pb-3 grid grid-cols-2 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { onTabChange(tab.id); setMobileMenuOpen(false); }}
                className={`py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-bullish text-primary-foreground'
                    : 'text-muted-foreground bg-surface-1'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
