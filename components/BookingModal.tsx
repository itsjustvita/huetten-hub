import React, { useState } from 'react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface BookingModalProps {
  checkInDate: Date;
  onClose: () => void;
  userId: number; // Neu: ID des eingeloggten Benutzers
}

export function BookingModal({
  checkInDate,
  onClose,
  userId,
}: BookingModalProps) {
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [bookingType, setBookingType] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!checkOutDate || !bookingType) {
      toast({
        title: 'Fehler',
        description: 'Bitte füllen Sie alle Felder aus.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          checkInDate,
          checkOutDate,
          bookingType,
        }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Speichern der Buchung');
      }

      toast({
        title: 'Erfolg',
        description: 'Ihre Buchung wurde erfolgreich gespeichert.',
      });
      onClose();
    } catch (error) {
      console.error('Fehler beim Speichern der Buchung:', error);
      toast({
        title: 'Fehler',
        description:
          'Es gab ein Problem beim Speichern Ihrer Buchung. Bitte versuchen Sie es erneut.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="z-50">
        <DialogHeader>
          <DialogTitle>Neue Buchung</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Anreise
            </label>
            <input
              type="text"
              value={format(checkInDate, 'dd.MM.yyyy', { locale: de })}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Abreise
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !checkOutDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkOutDate ? (
                    format(checkOutDate, 'dd.MM.yyyy', { locale: de })
                  ) : (
                    <span>Abreisedatum auswählen</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto p-0 data-[state=open]:pointer-events-auto"
                align="start"
                side="bottom"
              >
                <div className="z-[60]">
                  <Calendar
                    mode="single"
                    selected={checkOutDate}
                    onSelect={setCheckOutDate}
                    disabled={(date) => date <= checkInDate}
                    initialFocus
                    locale={de}
                    weekStartsOn={1}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Buchungstyp
            </label>
            <Select onValueChange={setBookingType}>
              <SelectTrigger>
                <SelectValue placeholder="Buchungstyp auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixe Buchung</SelectItem>
                <SelectItem value="reservation">Reservierung</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Wird gespeichert...' : 'Buchung speichern'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
