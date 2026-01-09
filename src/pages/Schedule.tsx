import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Calendar } from '@/components/ui/calendar';

interface ScheduleProps {
  onNavigate: (page: string) => void;
}

export default function Schedule({ onNavigate }: ScheduleProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const timeSlots = [
    { time: '08:00 - 09:00', available: 8, total: 10, instructor: 'Петрова А.' },
    { time: '09:00 - 10:00', available: 3, total: 10, instructor: 'Иванов С.' },
    { time: '10:00 - 11:00', available: 0, total: 10, instructor: 'Петрова А.' },
    { time: '12:00 - 13:00', available: 10, total: 10, instructor: 'Сидоров М.' },
    { time: '15:00 - 16:00', available: 5, total: 10, instructor: 'Иванов С.' },
    { time: '16:00 - 17:00', available: 7, total: 10, instructor: 'Петрова А.' },
  ];

  const getAvailabilityColor = (available: number, total: number) => {
    const ratio = available / total;
    if (ratio === 0) return 'bg-destructive/10 text-destructive';
    if (ratio < 0.3) return 'bg-orange-500/10 text-orange-600';
    return 'bg-green-500/10 text-green-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background pb-24">
      <div className="bg-primary text-primary-foreground pt-12 pb-6 px-6 rounded-b-[2rem]">
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
        <Card className="border-none shadow-lg">
          <CardContent className="p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-lg"
            />
          </CardContent>
        </Card>

        <div>
          <h2 className="text-xl font-semibold mb-4">Доступные слоты</h2>
          <div className="space-y-3">
            {timeSlots.map((slot, index) => {
              const isAvailable = slot.available > 0;
              return (
                <Card
                  key={index}
                  className={`border-none shadow-md ${
                    !isAvailable ? 'opacity-60' : 'hover:shadow-lg transition-shadow'
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                          <Icon name="Clock" size={20} className="text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base mb-1">{slot.time}</CardTitle>
                          <p className="text-sm text-muted-foreground">{slot.instructor}</p>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className={`rounded-full ${getAvailabilityColor(
                          slot.available,
                          slot.total
                        )}`}
                      >
                        {slot.available}/{slot.total}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button
                      className="w-full"
                      disabled={!isAvailable}
                      variant={isAvailable ? 'default' : 'secondary'}
                    >
                      {isAvailable ? 'Забронировать' : 'Нет мест'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
