import json
import os
import psycopg2
from datetime import datetime, date

def handler(event: dict, context) -> dict:
    """API для получения расписания бассейна и управления бронированиями"""
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    dsn = os.environ.get('DATABASE_URL')
    if not dsn:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Database connection not configured'}),
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(dsn)
    cur = conn.cursor()
    
    try:
        if method == 'GET':
            query_params = event.get('queryStringParameters', {}) or {}
            selected_date = query_params.get('date', str(date.today()))
            
            cur.execute("""
                SELECT 
                    s.id, 
                    s.session_date, 
                    s.session_time, 
                    s.max_capacity, 
                    s.available_spots,
                    i.name as instructor_name,
                    i.specialization
                FROM sessions s
                LEFT JOIN instructors i ON s.instructor_id = i.id
                WHERE s.session_date = %s
                ORDER BY s.session_time
            """, (selected_date,))
            
            sessions = []
            for row in cur.fetchall():
                sessions.append({
                    'id': row[0],
                    'date': row[1].isoformat(),
                    'time': str(row[2]),
                    'maxCapacity': row[3],
                    'availableSpots': row[4],
                    'instructor': row[5],
                    'specialization': row[6]
                })
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'sessions': sessions}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('userId', 1)
            session_id = body.get('sessionId')
            
            if not session_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'sessionId is required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("SELECT available_spots FROM sessions WHERE id = %s", (session_id,))
            result = cur.fetchone()
            
            if not result or result[0] <= 0:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'No available spots'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("""
                INSERT INTO bookings (user_id, session_id, booking_status)
                VALUES (%s, %s, 'active')
                ON CONFLICT (user_id, session_id) DO NOTHING
                RETURNING id
            """, (user_id, session_id))
            
            booking = cur.fetchone()
            if booking:
                cur.execute("UPDATE sessions SET available_spots = available_spots - 1 WHERE id = %s", (session_id,))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True, 'bookingId': booking[0]}),
                    'isBase64Encoded': False
                }
            else:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Booking already exists'}),
                    'isBase64Encoded': False
                }
        
        elif method == 'DELETE':
            body = json.loads(event.get('body', '{}'))
            booking_id = body.get('bookingId')
            
            if not booking_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'bookingId is required'}),
                    'isBase64Encoded': False
                }
            
            cur.execute("SELECT session_id FROM bookings WHERE id = %s", (booking_id,))
            result = cur.fetchone()
            
            if result:
                session_id = result[0]
                cur.execute("UPDATE bookings SET booking_status = 'cancelled' WHERE id = %s", (booking_id,))
                cur.execute("UPDATE sessions SET available_spots = available_spots + 1 WHERE id = %s", (session_id,))
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'success': True}),
                    'isBase64Encoded': False
                }
            else:
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Booking not found'}),
                    'isBase64Encoded': False
                }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        cur.close()
        conn.close()
