import React, { useState } from "react";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface BookingModalProps {
  checkInDate: Date;
  onClose: () => void;
  userId: number; // Neu: ID des eingeloggten Benutzers
  onBookingComplete: () => void; // Neue Prop
}

export function BookingModal({
  checkInDate,
  onClose,
  userId,
  onBookingComplete,
}: BookingModalProps) {
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [bookingType, setBookingType] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    console.log(userId);
    if (!checkOutDate || !bookingType) {
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle Felder aus.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          checkInDate,
          checkOutDate,
          bookingType,
        }),
      });

      if (!response.ok) {
        throw new Error("Fehler beim Speichern der Buchung");
      }

      toast({
        title: "Erfolg",
        description: "Ihre Buchung wurde erfolgreich gespeichert.",
      });
      onBookingComplete(); // Hier rufen wir die übergebene Funktion auf
      onClose();
    } catch (error) {
      console.error("Fehler beim Speichern der Buchung:", error);
      toast({
        title: "Fehler",
        description:
          "Es gab ein Problem beim Speichern Ihrer Buchung. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="z-50 bg-green-950/70 backdrop-blur-md border border-white/30 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-white">Neue Buchung</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white">
                Anreise
              </label>
              <Input
                type="text"
                value={format(checkInDate, "dd.MM.yyyy", { locale: de })}
                readOnly
                className="mt-1 block w-full rounded-md bg-white/15 border-white/10 text-white shadow-sm focus:border-white/30 focus:ring focus:ring-white/30 focus:ring-opacity-50"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-white">
                Abreise
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal bg-white/15 border-white/10 text-white hover:bg-white/10 hover:text-white/80",
                      !checkOutDate && "text-white/60"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkOutDate ? (
                      format(checkOutDate, "dd.MM.yyyy", { locale: de })
                    ) : (
                      <span>Abreisedatum auswählen</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 data-[state=open]:pointer-events-auto bg-green-900/50 backdrop-blur-md border border-white/20 rounded-lg shadow-lg"
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
                      className="bg-transparent text-white"
                      classNames={{
                        head_cell:
                          "text-white text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
                      }}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-white">
                Buchungstyp
              </label>
              <Select onValueChange={setBookingType}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Buchungstyp auswählen" />
                </SelectTrigger>
                <SelectContent className="bg-white/10 backdrop-blur-md border border-white/20 text-white">
                  <SelectItem value="fixed">Fixe Buchung</SelectItem>
                  <SelectItem value="reservation">Reservierung</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Button
                onClick={handleSubmit}
                className="w-full bg-white/20 text-white hover:bg-white/30"
                disabled={isLoading}
              >
                {isLoading ? "Wird gespeichert..." : "Buchung speichern"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
