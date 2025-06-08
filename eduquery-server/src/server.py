import http.server
import socketserver
import json
import base64

from cryptography.fernet import Fernet

from BBDD.Conection import bbdd

PORT = 8000
ENCRYPT_KEY = "6slnvhkJwc7Bl24Ox4dpbNg5s2vgEz-aMw4xuCjOsKc=" #No es lo correcto, pero es lo necesario

connect = bbdd("eduquery")
if connect:
    print("Conexión a la base de datos establecida.")
else:
    print("Error al conectar a la base de datos.")

class CustomHandler(http.server.BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")  
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        if self.path == "/getTeachersNames":
            cursor = connect.cursor()
            query = "SELECT id, fullname FROM teachers"
            cursor.execute(query)

            results = cursor.fetchall()
            response = []
            for row in results:
                response.append({"id": row[0], "fullname": row[1]})
            print (response)
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps(response).encode("utf-8"))

        
        else :
            self.send_response(404)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(b"Endpoint not found")

    def do_POST(self):
        if self.path == "/signup":
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)  

            try:
                received_data = json.loads(post_data)  
            except json.JSONDecodeError:
                self.send_response(400)
                self.send_header("Content-type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                response = {"error": "Invalid JSON"}
                self.wfile.write(json.dumps(response).encode("utf-8"))
                return

                
            print("Datos recibidos:", received_data)
            cursor = connect.cursor()
            fernet = Fernet(ENCRYPT_KEY)
            encrypted_pwd = fernet.encrypt(received_data.get('pwd').encode())
            encoded_pwd = base64.b64encode(encrypted_pwd).decode()
            query = f"INSERT INTO {received_data.get('role') + 's'} (fullname, dni, dir, telph, birthdate, pwd) VALUES ('{received_data.get('fullname')}', '{received_data.get('dni')}', '{received_data.get('address')}', '{received_data.get('telephone')}', '{received_data.get('birthdate')}', '{encoded_pwd}')"
            
            cursor.execute(query)
            connect.commit()

            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            response = {"message": "Datos recibidos correctamente", "data": received_data}
            self.wfile.write(json.dumps(response).encode("utf-8"))
        
        elif self.path == "/signin":
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)  

            try:
                received_data = json.loads(post_data)  
            except json.JSONDecodeError:
                self.send_response(400)
                self.send_header("Content-type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                response = {"error": "Invalid JSON"}
                self.wfile.write(json.dumps(response).encode("utf-8"))
                return

                
            print("Datos recibidos:", received_data)
            cursor = connect.cursor()
            fernet = Fernet(ENCRYPT_KEY)
            query = f"SELECT * FROM {received_data.get('role') + 's'} WHERE dni = '{received_data.get('dni')}'"
            cursor.execute(query)
            result = cursor.fetchone()
            if not result:
                self.send_response(400)
                self.send_header("Content-type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                response = {"message": "User not found"}
                self.wfile.write(json.dumps(response).encode("utf-8"))
                return
            encoded_pwd = result[6]
            encrypted_pwd = base64.b64decode(encoded_pwd)
            decrypted_pwd = fernet.decrypt(encrypted_pwd).decode()
            if decrypted_pwd == received_data.get('pwd'):
                self.send_response(200)
                self.send_header("Content-type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                response = {"message": "Signin succsessful"}
                self.wfile.write(json.dumps(response).encode("utf-8"))
            else:
                self.send_response(400)
                self.send_header("Content-type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                response = {"message": "Password incorrect"}
                self.wfile.write(json.dumps(response).encode("utf-8"))

        elif self.path == "/getUserInfo":
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)  

            try:
                received_data = json.loads(post_data)  
            except json.JSONDecodeError:
                self.send_response(400)
                self.send_header("Content-type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                response = {"error": "Invalid JSON"}
                self.wfile.write(json.dumps(response).encode("utf-8"))
                return

            cursor = connect.cursor()    
            print("Datos recibidos:", received_data)
            query = f"SELECT * FROM {received_data.get('role') + 's'} WHERE dni = '{received_data.get('dni')}'"
            cursor.execute(query)
            result = cursor.fetchone()
            if not result:
                self.send_response(400)
                self.send_header("Content-type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                response = {"message": "User not found"}
                self.wfile.write(json.dumps(response).encode("utf-8"))
                return
            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            response = {"id": result[0],"dni": result[2], "fullname": result[1], "address": result[3], "telph": result[4], "birthdate": result[5].isoformat()}
            self.wfile.write(json.dumps(response).encode("utf-8"))

        elif self.path == "/setTeacherQueue":
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)  

            try:
                received_data = json.loads(post_data)  
            except json.JSONDecodeError:
                self.send_response(400)
                self.send_header("Content-type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                response = {"error": "Invalid JSON"}
                self.wfile.write(json.dumps(response).encode("utf-8"))
                return

            cursor = connect.cursor()    
            print("Datos recibidos:", received_data)
            query = f"INSERT INTO `students_teachers`(`id_students`, `id_teachers`, `date`, `ended` ) VALUES ('{received_data.get('id_student')}','{received_data.get('id_teacher')}','{received_data.get('date')}', '{received_data.get('ended')}')"
            cursor.execute(query)
            connect.commit()

            self.send_response(200)
            self.send_header("Content-type", "application/json")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            response = {"message": "Datos insertados correctamente", "data": received_data}
            self.wfile.write(json.dumps(response).encode("utf-8"))

        elif self.path == "/getStudentsinQueue":
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)  

            try:
                received_data = json.loads(post_data)  
            except json.JSONDecodeError:
                self.send_response(400)
                self.send_header("Content-type", "application/json")
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                response = {"error": "Invalid JSON"}
                self.wfile.write(json.dumps(response).encode("utf-8"))
                return
            
            cursor = connect.cursor()
            query = f"SELECT * FROM `students` INNER JOIN students_teachers AS st ON st.id_students = students.id WHERE st.id_teachers = {received_data.get('id_teacher')} AND DATE(st.date) = '{received_data.get('date')}';"
            print("-------------------------------------------------------------")
            print(query)
            print("-------------------------------------------------------------")
            cursor.execute(query)

            results = cursor.fetchall()
            response = []
            for row in results:
                response.append({"id": row[0], "fullname": row[1], "ended": row[13], "date": row[12].strftime("%d/%m/%Y %H:%M:%S")})
            print (response)
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(json.dumps(response).encode("utf-8"))
        else:
            self.send_response(404)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(b"Endpoint not found")


print("Iniciando servidor HTTP...")
with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
    print(f"Servidor corriendo en http://localhost:{PORT}/")
    httpd.serve_forever()
