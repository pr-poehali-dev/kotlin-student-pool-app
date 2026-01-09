import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface RegisterProps {
  onNavigate: (page: string) => void;
  onRegister: (user: any) => void;
}

export default function Register({ onNavigate, onRegister }: RegisterProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const API_URL = 'https://functions.poehali.dev/8f0cc50f-5569-44e1-b1b5-8ec429e26a0e';

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Ошибка',
        description: 'Пароли не совпадают',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Успешно!',
          description: 'Аккаунт создан. Добро пожаловать!',
        });
        onRegister(data.user);
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось зарегистрироваться',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при регистрации',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Card className="w-full max-w-md animate-fade-in border-none shadow-xl">
        <CardHeader className="space-y-4 pb-6">
          <img 
            src="https://cdn.poehali.dev/files/i (1).jpeg" 
            alt="University Logo" 
            className="w-24 h-24 mx-auto object-contain rounded-xl"
          />
          <CardTitle className="text-3xl font-bold text-center text-primary">
            PacificPool
          </CardTitle>
          <CardDescription className="text-center text-base">
            Создайте аккаунт для бронирования
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Имя и фамилия
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Иван Иванов"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="h-11 text-base"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="student@university.edu"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="h-11 text-base"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Телефон
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (900) 123-45-67"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="h-11 text-base"
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
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="h-11 text-base"
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium">
                Подтвердите пароль
              </Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                className="h-11 text-base"
                required
                disabled={loading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-medium mt-6"
              disabled={loading}
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <button
              onClick={() => onNavigate('login')}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Уже есть аккаунт?{' '}
              <span className="text-primary font-medium">Войти</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
