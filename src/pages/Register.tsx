import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

interface RegisterProps {
  onNavigate: (page: string) => void;
}

export default function Register({ onNavigate }: RegisterProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('home');
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <Card className="w-full max-w-md animate-fade-in border-none shadow-xl">
        <CardHeader className="space-y-4 pb-6">
          <div className="w-16 h-16 mx-auto bg-primary/10 rounded-3xl flex items-center justify-center">
            <Icon name="UserPlus" size={32} className="text-primary" />
          </div>
          <CardTitle className="text-3xl font-semibold text-center">
            Регистрация
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
              />
            </div>
            <Button type="submit" className="w-full h-12 text-base font-medium mt-6">
              Зарегистрироваться
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
