// backend/config/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '..', 'database.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
        initializeTables();
    }
});

function initializeTables() {
    // Users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('driver', 'attender', 'admin')),
            license_no TEXT,
            employee_no TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error('Error creating users table:', err);
    });

    // Trip sheets table
    db.run(`
        CREATE TABLE IF NOT EXISTS trip_sheets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            driver_id INTEGER NOT NULL,
            driver_name TEXT NOT NULL,
            driver_phone TEXT NOT NULL,
            vehicle_number TEXT NOT NULL,
            trip_date DATE NOT NULL,
            start_km INTEGER NOT NULL,
            end_km INTEGER NOT NULL,
            total_km INTEGER NOT NULL,
            fuel_liters REAL,
            fuel_amount REAL,
            location TEXT,
            status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
            admin_notes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (driver_id) REFERENCES users(id)
        )
    `, (err) => {
        if (err) console.error('Error creating trip_sheets table:', err);
    });

    // Vehicles table
    db.run(`
        CREATE TABLE IF NOT EXISTS vehicles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            vehicle_number TEXT UNIQUE NOT NULL,
            vehicle_type TEXT NOT NULL,
            current_km INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error('Error creating vehicles table:', err);
        else seedInitialData();
    });
}

function seedInitialData() {
    // Check if admin exists
    db.get('SELECT * FROM users WHERE role = ?', ['admin'], (err, row) => {
        if (err) {
            console.error('Error checking admin:', err);
            return;
        }

        if (!row) {
            // Create default admin
            const bcrypt = require('bcryptjs');
            const hashedPassword = bcrypt.hashSync('admin123', 10);

            db.run(`
                INSERT INTO users (name, phone, password, role)
                VALUES (?, ?, ?, ?)
            `, ['System Admin', 'admin', hashedPassword, 'admin'], (err) => {
                if (err) console.error('Error creating admin:', err);
                else console.log('Default admin created (username: admin, password: admin123)');
            });
        }
    });
}

module.exports = db;
