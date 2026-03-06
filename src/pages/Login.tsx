import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AuthFormSplitScreen } from '@/components/ui/auth-form-split-screen';
import { TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import authBg from '@/assets/auth-bg.jpg';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (data: { email: string; password: string }) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast({ title: 'Login failed', description: error.message, variant: 'destructive' });
      throw error;
    }
    navigate('/');
  };

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
      title="Welcome back!"
      description="Sign in to access your market intelligence dashboard"
      imageSrc={authBg}
      imageAlt="Stock market trading dashboard with charts"
      onSubmit={handleLogin}
      forgotPasswordHref="/forgot-password"
      createAccountHref="/signup"
      submitLabel="Sign In"
    />
  );
};

export default Login;
