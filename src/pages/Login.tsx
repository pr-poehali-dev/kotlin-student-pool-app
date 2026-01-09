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
          <img 
            src="https://cdn.poehali.dev/files/image.png" 
            alt="University Logo" 
            className="w-24 h-24 mx-auto object-contain rounded-2xl"
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