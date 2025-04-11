import mysql.connector

def leer_archivo_sql(ruta_archivo):
    with open(ruta_archivo, "r", encoding="utf-8") as archivo:
        sentencia = ""
        sentencias = []

        for linea in archivo:
            linea = linea.strip()

            if not linea or linea.startswith("--"):
                continue

            sentencia += " " + linea

            if linea.endswith(";"):
                sentencias.append(sentencia.strip())
                sentencia = ""

        return sentencias

def bbdd(nombre_bbdd):
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
        )
        cursor = connection.cursor()

        try:
            cursor.execute(f"CREATE DATABASE {nombre_bbdd}")
            print(f"Base de datos '{nombre_bbdd}' creada correctamente.")
        except mysql.connector.Error as err:
            print(f"Error al crear la base de datos: {err}")
            cursor.execute(f"USE {nombre_bbdd}")
            return connection
        
        cursor.execute(f"USE {nombre_bbdd}")

        sentencias_sql = leer_archivo_sql("./eduquery-server/src/BBDD/eduquery.sql")

        for sentencia in sentencias_sql:
            cursor.execute(sentencia)
        return connection
    
    except mysql.connector.Error as err:
        print(f"Error de conexión: {err}")
        return None

