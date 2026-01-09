-- Таблица для пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для тренеров
CREATE TABLE IF NOT EXISTS instructors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    specialization VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для расписания сеансов
CREATE TABLE IF NOT EXISTS sessions (
    id SERIAL PRIMARY KEY,
    session_date DATE NOT NULL,
    session_time TIME NOT NULL,
    instructor_id INTEGER REFERENCES instructors(id),
    max_capacity INTEGER DEFAULT 60,
    available_spots INTEGER DEFAULT 60,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(session_date, session_time)
);

-- Таблица для бронирований
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    session_id INTEGER REFERENCES sessions(id),
    booking_status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, session_id)
);

-- Индексы для оптимизации
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_session ON bookings(session_id);

-- Добавляем тестовых тренеров
INSERT INTO instructors (name, specialization) VALUES 
    ('Петрова Анна', 'Плавание'),
    ('Иванов Сергей', 'Аквааэробика'),
    ('Сидоров Михаил', 'Синхронное плавание')
ON CONFLICT DO NOTHING;

-- Добавляем тестовые сеансы на следующие 7 дней
INSERT INTO sessions (session_date, session_time, instructor_id, max_capacity, available_spots)
SELECT 
    CURRENT_DATE + (day || ' days')::interval,
    time_slot::time,
    (FLOOR(RANDOM() * 3) + 1)::integer,
    60,
    FLOOR(RANDOM() * 60)::integer
FROM 
    generate_series(0, 6) AS day,
    unnest(ARRAY['08:00', '09:00', '10:00', '12:00', '15:00', '16:00', '17:00', '18:00']) AS time_slot
ON CONFLICT (session_date, session_time) DO NOTHING;