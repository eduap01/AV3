# AV3-MAIN

**AV3-MAIN** es una aplicación web desarrollada con Node.js y Express que permite gestionar estudios, asignaturas y softwares utilizados. Incluye funcionalidades para importar datos desde archivos CSV, visualizar y administrar usuarios y contenidos académicos.

---

## 🚀 Características

- Gestión de usuarios
- Administración de estudios y asignaturas
- Registro y visualización de softwares asociados
- Importación de software desde CSV
- Interfaz estructurada con rutas y modelos bien definidos

---

## 🛠️ Tecnologías utilizadas

- **Node.js**
- **Express.js**
- **MongoDB** (o base de datos compatible, configurable)
- **Mongoose / Sequelize** (según configuración de `models`)
- **bcrypt** (para encriptación de contraseñas)
- **csv-parser** (para leer archivos CSV)
- **Bootstrap / HTML estático** (en caso de vistas)

---

## 📦 Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/usuario/AV3-MAIN.git
cd AV3-MAIN
```

> ⚠️ Reemplaza `usuario` por tu nombre de usuario en GitHub cuando subas el repositorio.

2. Instala las dependencias:

```bash
npm install
```

3. Configura la base de datos en `keys.js` y asegúrate de que `database.js` tenga la conexión correcta.

4. Ejecuta el proyecto:

```bash
npm start
```

Accede a `http://localhost:3000` en tu navegador.

---

## 📁 Estructura del proyecto

```
AV3-MAIN/
│
├── app.js               # Archivo principal de la app Express
├── bin/www              # Inicialización del servidor
├── database.js          # Conexión a la base de datos
├── keys.js              # Configuración de claves/credenciales
├── models/              # Modelos de datos: user, study, subject, software
├── files/               # Archivos de prueba: CSV, imágenes, texto
│   ├── softwares/
│   ├── mewtwo.jpg
│   └── ordenarCochesWPF.txt
├── package.json         # Dependencias y scripts
├── .gitignore
└── node_modules/
```

---

## 📊 Datos de ejemplo

Se incluyen archivos en la carpeta `files/` que pueden ser usados como datos de prueba:

- `softwares.csv`: lista de programas
- `software_data.csv`: datos adicionales
- `ordenarCochesWPF.txt`: ejemplo de archivo WPF
- `mewtwo.jpg`: recurso gráfico

---

## 👨‍💻 Autores

- Eduardo Arévalo  
- Iván García  
- Raúl Fernández  
- Jesús Márquez

Contacto: [eduardoarevaloportero@gmail.com](mailto:eduardoarevaloportero@gmail.com)
