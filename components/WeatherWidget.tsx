import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import * as featherIcons from "feather-icons";

interface WeatherData {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
  };
}

const weatherCodes: { [key: number]: { icon: string; description: string } } = {
  0: { icon: "sun", description: "Klar" },
  1: { icon: "sun", description: "Überwiegend klar" },
  2: { icon: "cloud", description: "Teilweise bewölkt" },
  3: { icon: "cloud", description: "Bewölkt" },
  45: { icon: "cloud-drizzle", description: "Nebel" },
  48: { icon: "cloud-drizzle", description: "Reifnebel" },
  51: { icon: "cloud-rain", description: "Leichter Nieselregen" },
  53: { icon: "cloud-rain", description: "Mäßiger Nieselregen" },
  55: { icon: "cloud-rain", description: "Starker Nieselregen" },
  61: { icon: "cloud-rain", description: "Leichter Regen" },
  63: { icon: "cloud-rain", description: "Mäßiger Regen" },
  65: { icon: "cloud-rain", description: "Starker Regen" },
  71: { icon: "cloud-snow", description: "Leichter Schneefall" },
  73: { icon: "cloud-snow", description: "Mäßiger Schneefall" },
  75: { icon: "cloud-snow", description: "Starker Schneefall" },
  95: { icon: "cloud-lightning", description: "Gewitter" },
};

const getWeatherIcon = (code: number) => {
  const weatherInfo = weatherCodes[code] || {
    icon: "cloud",
    description: "Unbekannt",
  };
  return featherIcons.icons[weatherInfo.icon].toSvg({
    width: 36,
    height: 36,
    color: "white",
  });
};

export const WeatherWidget = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=47.41&longitude=9.89&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin&forecast_days=4`
        );
        if (!response.ok) {
          throw new Error("Netzwerkantwort war nicht ok");
        }
        const data: WeatherData = await response.json();
        setWeatherData(data);
      } catch (err) {
        setError("Fehler beim Laden der Wetterdaten");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  if (loading) return <Card className="glassmorphism p-5">Laden...</Card>;
  if (error) return <Card className="glassmorphism p-5">{error}</Card>;
  if (!weatherData) return null;

  const currentWeather = weatherCodes[weatherData.current.weather_code] || {
    icon: "cloud",
    description: "Unbekannt",
  };

  return (
    <Card className="glassmorphism p-5">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Doren</h2>
          <div className="flex items-center">
            <div
              className="mr-2 flex items-center justify-center"
              style={{ width: "68px", height: "68px" }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: getWeatherIcon(weatherData.current.weather_code),
                }}
              />
            </div>
            <div>
              <p className="text-4xl font-bold text-white">
                {Math.round(weatherData.current.temperature_2m)}°C
              </p>
              <p className="text-sm capitalize text-white">
                {currentWeather.description}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-6 gap-4 mb-6">
        <div className="flex items-center">
          <div
            dangerouslySetInnerHTML={{
              __html: featherIcons.icons["droplet"].toSvg({
                width: 18,
                height: 18,
                color: "white",
              }),
            }}
          />
          <span className="ml-2 text-white">
            {Math.round(weatherData.current.relative_humidity_2m)}%
          </span>
        </div>
        <div className="flex items-center">
          <div
            dangerouslySetInnerHTML={{
              __html: featherIcons.icons["wind"].toSvg({
                width: 18,
                height: 18,
                color: "white",
              }),
            }}
          />
          <span className="ml-2 text-white">
            {Math.round(weatherData.current.wind_speed_10m)} km/h
          </span>
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-3 text-white">
        3-Tage-Vorhersage:
      </h3>
      <div className="grid grid-cols-3 gap-4">
        {weatherData.daily.time.slice(1, 4).map((date, index) => (
          <div key={date} className="bg-white/10 rounded-lg p-3 text-center">
            <p className="text-white font-semibold mb-2">
              {format(new Date(date), "EEE", { locale: de })}
            </p>
            <div
              className="mb-2 text-center flex items-center justify-center"
              dangerouslySetInnerHTML={{
                __html: getWeatherIcon(
                  weatherData.daily.weather_code[index + 1]
                ),
              }}
            />
            <div className="text-sm text-white flex gap-1 items-center justify-center mt-2">
              <span className="flex items-center">
                <span
                  dangerouslySetInnerHTML={{
                    __html: featherIcons.icons["arrow-up"].toSvg({
                      width: 12,
                      height: 12,
                      color: "white",
                    }),
                  }}
                />
                {Math.round(weatherData.daily.temperature_2m_max[index + 1])}°
              </span>
              <span className="flex items-center">
                <span
                  dangerouslySetInnerHTML={{
                    __html: featherIcons.icons["arrow-down"].toSvg({
                      width: 12,
                      height: 12,
                      color: "white",
                    }),
                  }}
                />
                {Math.round(weatherData.daily.temperature_2m_min[index + 1])}°
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
