import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TrendingUp, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import authBg from '@/assets/auth-bg.jpg';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes('type=recovery')) {
      toast({ title: 'Invalid link', description: 'This password reset link is invalid or expired.', variant: 'destructive' });
    }
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: 'Password too short', description: 'Must be at least 6 characters', variant: 'destructive' });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Password updated', description: 'You can now sign in with your new password.' });
      navigate('/login');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="flex min-h-screen bg-background">
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <motion.div
          className="w-full max-w-sm space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="space-y-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground text-xl tracking-tight">
                Stock<span className="text-primary">Sense</span>
                <span className="text-xs font-mono text-muted-foreground ml-1.5">AI</span>
              </span>
            </Link>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Set new password</h1>
            <p className="text-sm text-muted-foreground">Enter your new password below</p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2"><Lock className="w-4 h-4 animate-pulse" /> Updating...</span>
                ) : (
                  <span className="flex items-center gap-2"><Lock className="w-4 h-4" /> Update Password</span>
                )}
              </Button>
            </form>
          </motion.div>

          <motion.p variants={itemVariants} className="text-center text-sm text-muted-foreground">
            Remember your password?{' '}
            <Link to="/login" className="font-semibold text-primary hover:underline">Sign in here</Link>.
          </motion.p>
        </motion.div>
      </div>
      <div className="relative hidden lg:block lg:w-1/2">
        <img src={authBg} alt="Stock market background" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-background/20" />
      </div>
    </div>
  );
};

export default ResetPassword;
