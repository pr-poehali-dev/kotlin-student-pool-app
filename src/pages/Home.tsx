import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

interface HomeProps {
  onNavigate: (page: string) => void;
  user: any;
}

export default function Home({ onNavigate, user }: HomeProps) {
  const news = [
    {
      id: 1,
      title: 'Новые дорожки открыты',
      description: 'Обновленные дорожки 7-8 готовы к использованию',
      date: '2 дня назад',
      icon: 'Sparkles',
    },
    {
      id: 2,
      title: 'Изменения в расписании',
      description: 'С понедельника новое расписание занятий',
      date: '5 дней назад',
      icon: 'Calendar',
    },
    {
      id: 3,
      title: 'Акция для студентов',
      description: 'Скидка 20% на абонементы до конца месяца',
      date: '1 неделю назад',
      icon: 'Tag',
    },
  ];

  const quickActions = [
    { label: 'Забронировать', icon: 'CalendarPlus', page: 'schedule' },
    { label: 'Расписание', icon: 'Calendar', page: 'schedule' },
    { label: 'Профиль', icon: 'User', page: 'profile' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background pb-24">
      <div className="bg-primary text-primary-foreground pt-12 pb-8 px-6 rounded-b-[2rem]">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Привет, {user?.name?.split(' ')[0] || 'Гость'}! 👋</h1>
              <p className="text-primary-foreground/80">
                Студенческий бассейн
              </p>
            </div>
            <button
              onClick={() => onNavigate('profile')}
              className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <Icon name="Bell" size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 -mt-4">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() => onNavigate(action.page)}
              className="bg-card p-5 rounded-2xl shadow-lg hover:shadow-xl hover-scale transition-all"
            >
              <div className="w-10 h-10 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                <Icon name={action.icon as any} size={20} className="text-primary" />
              </div>
              <p className="text-xs font-medium text-foreground">{action.label}</p>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Новости</h2>
            <Badge variant="secondary" className="rounded-full">
              {news.length} новых
            </Badge>
          </div>

          {news.map((item) => (
            <Card
              key={item.id}
              className="border-none shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Icon name={item.icon as any} size={20} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base mb-1">{item.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {item.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-muted-foreground">{item.date}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 bg-gradient-to-br from-primary to-accent text-primary-foreground border-none">
          <CardHeader>
            <CardTitle className="text-lg">Следующая тренировка</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Среда, 15:00 - 16:00
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="secondary"
              onClick={() => onNavigate('schedule')}
              className="w-full"
            >
              Посмотреть детали
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}