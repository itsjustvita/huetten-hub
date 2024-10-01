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

interface BookingModalProps {
  checkInDate: Date;
  onClose: () => void;
}

export function BookingModal({ checkInDate, onClose }: BookingModalProps) {
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [bookingType, setBookingType] = useState<string>('');

  const handleSubmit = () => {
    // Hier können Sie die Logik für das Speichern der Buchung implementieren
    console.log('Buchung:', { checkInDate, checkOutDate, bookingType });
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent>
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
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Abreise
            </label>
            <Calendar
              mode="single"
              selected={checkOutDate}
              onSelect={setCheckOutDate}
              disabled={(date) => date <= checkInDate}
              className="rounded-md border"
            />
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
          <Button onClick={handleSubmit} className="w-full">
            Buchung speichern
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
