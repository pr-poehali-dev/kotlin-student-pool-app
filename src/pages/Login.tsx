import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface LoginProps {
  onNavigate: (page: string) => void;
}

export default function Login({ onNavigate }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('home');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Card className="w-full max-w-md animate-fade-in border-none shadow-xl">
        <CardHeader className="space-y-4 pb-8">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-3xl flex items-center justify-center">
            <Icon name="Waves" size={32} className="text-primary" />
          </div>
          <CardTitle className="text-3xl font-semibold text-center">
            Добро пожаловать
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
              />
            </div>
            <Button type="submit" className="w-full h-12 text-base font-medium mt-6">
              Войти
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
