import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, ArrowLeft, Loader2 } from 'lucide-react';

interface RoleRow {
  id: string;
  user_id: string;
  role: 'admin' | 'moderator' | 'user';
  created_at: string;
}

const Admin = () => {
  const { user, roles } = useAuth();
  const { toast } = useToast();
  const [rows, setRows] = useState<RoleRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      toast({ title: 'Failed to load roles', description: error.message, variant: 'destructive' });
    } else {
      setRows((data ?? []) as RoleRow[]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back to dashboard
        </Link>

        <Card className="bg-surface-1 border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-bullish" />
              <CardTitle>Admin · Role Management</CardTitle>
            </div>
            <CardDescription>
              Signed in as {user?.email} · Your roles: {roles.join(', ') || 'none'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading roles…
              </div>
            ) : rows.length === 0 ? (
              <p className="text-sm text-muted-foreground">No role assignments found.</p>
            ) : (
              <div className="space-y-2">
                {rows.map((r) => (
                  <div key={r.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-2 border border-border">
                    <div className="font-mono text-xs text-muted-foreground truncate max-w-[60%]">{r.user_id}</div>
                    <Badge variant={r.role === 'admin' ? 'default' : 'secondary'}>{r.role}</Badge>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 pt-4 border-t border-border text-xs text-muted-foreground">
              <p>To grant the first admin: open Lovable Cloud → SQL editor and run:</p>
              <pre className="mt-2 p-2 bg-surface-2 rounded text-[11px] overflow-x-auto">
{`INSERT INTO public.user_roles (user_id, role)
VALUES ('<your-user-id>', 'admin')
ON CONFLICT DO NOTHING;`}
              </pre>
            </div>
            <Button onClick={load} variant="outline" size="sm" className="mt-4">Refresh</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
