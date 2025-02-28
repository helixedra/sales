import Database from "better-sqlite3";

export const db = new Database("db.sqlite");

// db.prepare(
//   `
//   CREATE TABLE IF NOT EXISTS users (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     email TEXT UNIQUE NOT NULL,
//     password TEXT NOT NULL,
//     name TEXT
//   );
// `
// ).run();

// export function getUsers() {
//   return db.prepare("SELECT * FROM users").all();
// }

// export function addUser(name: string, email: string) {
//   const stmt = db.prepare("INSERT INTO users (name, email) VALUES (?, ?)");
//   stmt.run(name, email);
// }
