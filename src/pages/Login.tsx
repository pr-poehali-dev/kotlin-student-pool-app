import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface LoginProps {
  onNavigate: (page: string) => void;
  onLogin: (user: any) => void;
}

export default function Login({ onNavigate, onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const API_URL = 'https://functions.poehali.dev/8f0cc50f-5569-44e1-b1b5-8ec429e26a0e';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Успешно!',
          description: 'Добро пожаловать в PacificPool',
        });
        onLogin(data.user);
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось войти',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при входе',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Card className="w-full max-w-md animate-fade-in border-none shadow-xl">
        <CardHeader className="space-y-4 pb-8">
          <img 
            src="https://cdn.poehali.dev/files/i (1).jpeg" 
            alt="University Logo" 
            className="w-24 h-24 mx-auto object-contain rounded-xl"
          />
          <CardTitle className="text-3xl font-bold text-center text-primary">
            PacificPool
          </CardTitle>
          <CardDescription className="text-center text-base">
            Войдите в систему бассейна
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 text-base"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Пароль
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 text-base"
                required
                disabled={loading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium mt-6"
              disabled={loading}
            >
              {loading ? 'Вход...' : 'Войти'}
            </Button>
          </form>
          <div className="mt-8 text-center">
            <button
              onClick={() => onNavigate('register')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Нет аккаунта?{' '}
              <span className="text-primary font-medium">Зарегистрироваться</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
