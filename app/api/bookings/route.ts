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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    const connection = await mysql.createConnection(dbConfig);

    if (id) {
      // Einzelne Buchung abrufen
      const query = `
        SELECT b.id, b.check_in_date, b.check_out_date, b.booking_type, u.username
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        WHERE b.id = ?
      `;
      const [rows] = await connection.execute<mysql.RowDataPacket[]>(query, [
        id,
      ]);
      await connection.end();

      if (rows.length === 0) {
        return NextResponse.json(
          { error: "Buchung nicht gefunden" },
          { status: 404 }
        );
      }
      return NextResponse.json(rows[0]);
    } else {
      // Alle zukünftigen Buchungen abrufen
      const query = `
        SELECT b.id, b.check_in_date, b.check_out_date, b.booking_type, u.username
        FROM bookings b
        JOIN users u ON b.user_id = u.id
      `;
      const [rows] = await connection.execute(query);
      await connection.end();

      return NextResponse.json(rows);
    }
  } catch (error) {
    console.error("Fehler beim Abrufen der Buchung(en):", error);
    return NextResponse.json(
      { error: "Interner Serverfehler", details: (error as Error).message },
      { status: 500 }
    );
  }
}
