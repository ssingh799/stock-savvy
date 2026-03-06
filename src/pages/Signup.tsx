import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AuthFormSplitScreen } from '@/components/ui/auth-form-split-screen';
import { TrendingUp, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import authBg from '@/assets/auth-bg.jpg';

const Signup = () => {
  const [success, setSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const { toast } = useToast();

  const handleSignup = async (data: { email: string; password: string }) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      toast({ title: 'Signup failed', description: error.message, variant: 'destructive' });
      throw error;
    }
    setSubmittedEmail(data.email);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="w-full max-w-md border-border bg-card text-center">
          <CardHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-2">
              <CheckCircle className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-foreground">Check your email</CardTitle>
            <CardDescription>
              We've sent a verification link to <span className="text-foreground font-medium">{submittedEmail}</span>. Please verify your email to sign in.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Link to="/login" className="text-sm text-primary hover:underline">Back to login</Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <AuthFormSplitScreen
      logo={
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground text-xl tracking-tight">
            Stock<span className="text-primary">Sense</span>
            <span className="text-xs font-mono text-muted-foreground ml-1.5">AI</span>
          </span>
        </Link>
      }
      title="Create your account"
      description="Start tracking markets with AI-powered insights"
      imageSrc={authBg}
      imageAlt="Stock market trading dashboard with charts"
      onSubmit={handleSignup}
      forgotPasswordHref="/forgot-password"
      createAccountHref="/login"
      createAccountText="Already have an account?"
      submitLabel="Create Account"
    />
  );
};

export default Signup;
