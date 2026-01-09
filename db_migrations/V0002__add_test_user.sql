-- Добавляем тестового пользователя для отладки
INSERT INTO users (name, email, phone, password_hash) 
VALUES ('Тестовый пользователь', 'test@student.ru', '+7 (900) 000-00-00', 'test_hash_123')
ON CONFLICT (email) DO NOTHING;