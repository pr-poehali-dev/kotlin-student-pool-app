import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface ProfileProps {
  onNavigate: (page: string) => void;
  user: any;
  onLogout: () => void;
}

export default function Profile({ onNavigate, user, onLogout }: ProfileProps) {
  const userInfo = {
    name: user?.name || 'Пользователь',
    email: user?.email || 'email@example.com',
    phone: user?.phone || '+7 (000) 000-00-00',
    status: 'Студент',
    visits: 24,
  };

  const bookingHistory = [
    { date: '15 января', time: '15:00 - 16:00', status: 'completed' },
    { date: '12 января', time: '10:00 - 11:00', status: 'completed' },
    { date: '8 января', time: '16:00 - 17:00', status: 'cancelled' },
  ];

  const settings = [
    { id: 'notifications', label: 'Push-уведомления', enabled: true },
    { id: 'email', label: 'Email-уведомления', enabled: true },
    { id: 'reminders', label: 'Напоминания', enabled: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background pb-24">
      <div className="bg-primary text-primary-foreground pt-12 pb-8 px-6 rounded-b-[2rem]">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => onNavigate('home')}
            className="mb-4 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <Icon name="ArrowLeft" size={20} />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl">
              👤
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">{userInfo.name}</h1>
              <Badge variant="secondary" className="bg-white/20 text-white border-none">
                {userInfo.status}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 -mt-4 space-y-6">
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Статистика</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-2">
                  <Icon name="Activity" size={20} className="text-primary" />
                </div>
                <p className="text-2xl font-bold">{userInfo.visits}</p>
                <p className="text-xs text-muted-foreground">Посещений</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-green-500/10 rounded-2xl flex items-center justify-center mb-2">
                  <Icon name="CheckCircle" size={20} className="text-green-600" />
                </div>
                <p className="text-2xl font-bold">18</p>
                <p className="text-xs text-muted-foreground">Завершено</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto bg-orange-500/10 rounded-2xl flex items-center justify-center mb-2">
                  <Icon name="Clock" size={20} className="text-orange-600" />
                </div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-xs text-muted-foreground">Активных</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Контактная информация</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Icon name="Mail" size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{userInfo.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <Icon name="Phone" size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Телефон</p>
                <p className="font-medium">{userInfo.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">История бронирований</CardTitle>
            <CardDescription>Последние 3 посещения</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {bookingHistory.map((booking, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl bg-muted/50"
              >
                <div>
                  <p className="font-medium text-sm">{booking.date}</p>
                  <p className="text-xs text-muted-foreground">{booking.time}</p>
                </div>
                <Badge
                  variant="secondary"
                  className={
                    booking.status === 'completed'
                      ? 'bg-green-500/10 text-green-600'
                      : 'bg-orange-500/10 text-orange-600'
                  }
                >
                  {booking.status === 'completed' ? 'Завершено' : 'Отменено'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Настройки</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {settings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between">
                <Label htmlFor={setting.id} className="font-normal">
                  {setting.label}
                </Label>
                <Switch id={setting.id} defaultChecked={setting.enabled} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Button
          variant="outline"
          className="w-full"
          onClick={onLogout}
        >
          <Icon name="LogOut" size={18} className="mr-2" />
          Выйти
        </Button>
      </div>
    </div>
  );
}