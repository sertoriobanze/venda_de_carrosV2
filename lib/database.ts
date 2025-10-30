import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync("cars.db");

export function initDatabase() {
  db.execSync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS cars (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand TEXT,
      model TEXT,
      year INTEGER,
      price REAL,
      description TEXT,
      imagePath TEXT,
      userId TEXT ,
      phone TEXT ,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export function insertCar(car: {
  brand: string;
  model: string;
  year: number;
  price: number;
  description: string;
  imagePath: string;
  userId: string;
  phone?: string;
}) {
  const result = db.runSync(
    `INSERT INTO cars (brand, model, year, price, description, imagePath, userId, phone) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [car.brand, car.model, car.year, car.price, car.description, car.imagePath, car.userId, car.phone || '']
  );
  return result.lastInsertRowId;
}
// LISTA TODOS OS CARROS
export function getAllCars(): any[] {
  try {
    return db.getAllSync('SELECT * FROM cars ORDER BY id DESC');
  } catch (error) {
    console.error('Erro ao buscar carros:', error);
    return [];
  }
}

// (Opcional) Excluir carro por ID
export function deleteCarById(id: number) {
  db.runSync('DELETE FROM cars WHERE id = ?', [id]);
}

// lib/database.ts → ADICIONE ESTA FUNÇÃO TEMPORÁRIA
export function resetDatabase() {
  db.execSync(`DROP TABLE IF EXISTS cars;`);
  initDatabase();
}