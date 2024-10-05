import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

// Datenbankverbindung konfigurieren
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

export async function POST(request: Request) {
  try {
    const { userId, checkInDate, checkOutDate, bookingType } =
      await request.json();

    console.log("Empfangene Daten:", {
      userId,
      checkInDate,
      checkOutDate,
      bookingType,
    });

    // Validierung der Eingabedaten
    if (!userId || !checkInDate || !checkOutDate || !bookingType) {
      return NextResponse.json(
        { error: "Alle Felder sind erforderlich" },
        { status: 400 }
      );
    }

    // Verbindung zur Datenbank herstellen
    const connection = await mysql.createConnection(dbConfig);

    // SQL-Abfrage vorbereiten
    const query = `
      INSERT INTO bookings (user_id, check_in_date, check_out_date, booking_type)
      VALUES (?, ?, ?, ?)
    `;
    const values = [userId, checkInDate, checkOutDate, bookingType];

    console.log("SQL-Abfrage:", query);
    console.log("Werte:", values);

    // Buchung in der Datenbank erstellen
    const [result] = await connection.execute(query, values);

    // Verbindung schließen
    await connection.end();

    // Erfolgreiche Antwort senden
    return NextResponse.json(
      {
        message: "Buchung erfolgreich erstellt",
        bookingId: (result as mysql.ResultSetHeader).insertId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Detaillierter Fehler beim Erstellen der Buchung:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// Fügen Sie diese Funktion zur bestehenden Datei hinzu

export async function GET(request: Request) {
  try {
    const connection = await mysql.createConnection(dbConfig);
    const query = `
      SELECT check_in_date, check_out_date, booking_type
      FROM bookings
      WHERE check_out_date >= CURDATE()
    `;
    const [rows] = await connection.execute(query);
    await connection.end();

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Fehler beim Abrufen der Buchungen:", error);
    return NextResponse.json(
      { error: "Interner Serverfehler", details: (error as Error).message },
      { status: 500 }
    );
  }
}
