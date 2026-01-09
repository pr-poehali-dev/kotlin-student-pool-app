import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface ScheduleProps {
  onNavigate: (page: string) => void;
}

interface Session {
  id: number;
  date: string;
  time: string;
  maxCapacity: number;
  availableSpots: number;
  instructor: string;
  specialization: string;
}

export default function Schedule({ onNavigate }: ScheduleProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const { toast } = useToast();

  const API_URL = 'https://functions.poehali.dev/951f20f4-d784-4d9e-910e-811075c16333';

  useEffect(() => {
    if (date) {
      fetchSessions(date);
    }
  }, [date]);

  const fetchSessions = async (selectedDate: Date) => {
    setLoading(true);
    const dateStr = selectedDate.toISOString().split('T')[0];
    
    try {
      const response = await fetch(`${API_URL}?date=${dateStr}`);
      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить расписание',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (sessionId: number) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 1, sessionId }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setBookingId(data.bookingId);
        toast({
          title: 'Успешно!',
          description: 'Вы записаны на сеанс',
        });
        if (date) fetchSessions(date);
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось забронировать',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при бронировании',
        variant: 'destructive',
      });
    }
  };

  const handleCancelBooking = async () => {
    if (!bookingId) return;
    
    try {
      const response = await fetch(API_URL, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setBookingId(null);
        toast({
          title: 'Отменено',
          description: 'Бронирование успешно отменено',
        });
        if (date) fetchSessions(date);
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось отменить бронирование',
        variant: 'destructive',
      });
    }
  };

  const getAvailabilityColor = (available: number, total: number) => {
    const ratio = available / total;
    if (ratio === 0) return 'bg-destructive/10 text-destructive';
    if (ratio < 0.3) return 'bg-orange-500/10 text-orange-600';
    return 'bg-green-500/10 text-green-600';
  };

  const formatTime = (time: string) => {
    return time.slice(0, 5);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-primary text-primary-foreground pt-12 pb-6 px-6">
        <div className="max-w-2xl mx-auto">
          <button
            onClick={() => onNavigate('home')}
            className="mb-4 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <Icon name="ArrowLeft" size={20} />
          </button>
          <h1 className="text-3xl font-bold mb-2">Расписание</h1>
          <p className="text-primary-foreground/80">
            Выберите удобное время
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 mt-6 space-y-6">
        <Card className="border border-border/50">
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-lg"
            />
          </CardContent>
        </Card>

        {bookingId && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon name="CheckCircle" className="text-primary" size={20} />
                <span className="text-sm font-medium">У вас есть активная запись</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleCancelBooking}>
                Отменить
              </Button>
            </CardContent>
          </Card>
        )}

        <div>
          <h2 className="text-xl font-semibold mb-4">
            Доступные слоты на {date?.toLocaleDateString('ru-RU')}
          </h2>
          
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              Загрузка расписания...
            </div>
          ) : sessions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Нет доступных сеансов на эту дату
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => {
                const isAvailable = session.availableSpots > 0;
                return (
                  <Card
                    key={session.id}
                    className={`border border-border/50 ${
                      !isAvailable ? 'opacity-60' : ''
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                            <Icon name="Clock" size={20} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold text-base">{formatTime(session.time)}</p>
                            <p className="text-sm text-muted-foreground">{session.instructor}</p>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className={`rounded-full px-3 ${getAvailabilityColor(
                            session.availableSpots,
                            session.maxCapacity
                          )}`}
                        >
                          {session.availableSpots}/{session.maxCapacity}
                        </Badge>
                      </div>
                      <Button
                        className="w-full"
                        disabled={!isAvailable}
                        variant={isAvailable ? 'default' : 'secondary'}
                        onClick={() => handleBooking(session.id)}
                      >
                        {isAvailable ? 'Записаться' : 'Нет мест'}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
