import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ScheduleProps {
  onNavigate: (page: string) => void;
  user: any;
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

export default function Schedule({ onNavigate, user }: ScheduleProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [weekDates, setWeekDates] = useState<Date[]>([]);
  const { toast } = useToast();

  const API_URL = 'https://functions.poehali.dev/951f20f4-d784-4d9e-910e-811075c16333';

  useEffect(() => {
    generateWeekDates(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (weekDates.length > 0) {
      fetchAllSessions();
    }
  }, [weekDates]);

  const generateWeekDates = (startDate: Date) => {
    const dates: Date[] = [];
    const start = new Date(startDate);
    start.setDate(start.getDate() - start.getDay() + 1);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    setWeekDates(dates);
  };

  const fetchAllSessions = async () => {
    setLoading(true);
    const allSessions: Session[] = [];
    
    try {
      for (const date of weekDates) {
        const dateStr = date.toISOString().split('T')[0];
        const response = await fetch(`${API_URL}?date=${dateStr}`);
        const data = await response.json();
        allSessions.push(...(data.sessions || []));
      }
      setSessions(allSessions);
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
        body: JSON.stringify({ userId: user?.id || 1, sessionId }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        toast({
          title: 'Успешно!',
          description: 'Вы записаны на сеанс',
        });
        fetchAllSessions();
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

  const formatTime = (time: string) => {
    return time.slice(0, 5);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
  };

  const formatWeekday = (date: Date) => {
    return date.toLocaleDateString('ru-RU', { weekday: 'short' });
  };

  const goToPreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedDate(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedDate(newDate);
  };

  const groupSessionsByTime = () => {
    const grouped: { [key: string]: { [key: string]: Session } } = {};
    
    sessions.forEach((session) => {
      const time = formatTime(session.time);
      if (!grouped[time]) {
        grouped[time] = {};
      }
      grouped[time][session.date] = session;
    });
    
    return grouped;
  };

  const groupedSessions = groupSessionsByTime();
  const times = Object.keys(groupedSessions).sort();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-primary text-primary-foreground pt-12 pb-6 px-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => onNavigate('home')}
            className="mb-4 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <Icon name="ArrowLeft" size={20} />
          </button>
          <h1 className="text-3xl font-bold mb-2">Расписание</h1>
          <p className="text-primary-foreground/80">
            Выберите удобное время для посещения
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-6">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={goToPreviousWeek} size="sm">
            <Icon name="ChevronLeft" size={18} className="mr-1" />
            Назад
          </Button>
          <h2 className="text-lg font-semibold">
            Неделя с {weekDates[0] && formatDate(weekDates[0])} по {weekDates[6] && formatDate(weekDates[6])}
          </h2>
          <Button variant="outline" onClick={goToNextWeek} size="sm">
            Вперед
            <Icon name="ChevronRight" size={18} className="ml-1" />
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">
            Загрузка расписания...
          </div>
        ) : (
          <Card className="border border-border/50 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold w-24 sticky left-0 bg-muted/50">
                      Время
                    </TableHead>
                    {weekDates.map((date, index) => (
                      <TableHead key={index} className="text-center font-semibold min-w-[120px]">
                        <div>{formatWeekday(date)}</div>
                        <div className="text-xs text-muted-foreground font-normal">
                          {formatDate(date)}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {times.map((time) => (
                    <TableRow key={time} className="hover:bg-muted/30">
                      <TableCell className="font-medium sticky left-0 bg-background">
                        {time}
                      </TableCell>
                      {weekDates.map((date, index) => {
                        const dateStr = date.toISOString().split('T')[0];
                        const session = groupedSessions[time]?.[dateStr];
                        
                        if (!session) {
                          return (
                            <TableCell key={index} className="text-center">
                              <div className="text-xs text-muted-foreground">—</div>
                            </TableCell>
                          );
                        }

                        const isAvailable = session.availableSpots > 0;
                        
                        return (
                          <TableCell key={index} className="p-2">
                            <div className="space-y-1">
                              <div className="text-xs text-muted-foreground truncate">
                                Тренер: {session.instructor}
                              </div>
                              <div className="text-xs font-medium">
                                {session.availableSpots}/{session.maxCapacity}
                              </div>
                              <Button
                                size="sm"
                                className="w-full h-7 text-xs"
                                disabled={!isAvailable}
                                variant={isAvailable ? 'default' : 'secondary'}
                                onClick={() => handleBooking(session.id)}
                              >
                                {isAvailable ? 'Записаться' : 'Нет мест'}
                              </Button>
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        )}

        {!loading && times.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            Нет доступных сеансов на эту неделю
          </div>
        )}
      </div>
    </div>
  );
}