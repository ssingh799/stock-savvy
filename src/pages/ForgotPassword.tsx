import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { TrendingUp, CheckCircle, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import authBg from '@/assets/auth-bg.jpg';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { toast } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      setSent(true);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md border-border bg-card text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
              <CheckCircle className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-foreground">Check your email</CardTitle>
            <CardDescription>
              If an account exists for <span className="text-foreground font-medium">{email}</span>, we've sent a password reset link.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Link to="/login" className="text-sm text-primary hover:underline">Back to login</Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

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
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Reset password</h1>
            <p className="text-sm text-muted-foreground">Enter your email and we'll send a reset link</p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <form onSubmit={handleReset} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2"><Mail className="w-4 h-4 animate-pulse" /> Sending...</span>
                ) : (
                  <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> Send Reset Link</span>
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

export default ForgotPassword;
