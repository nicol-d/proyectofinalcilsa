const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');

// Middleware para poder leer el cuerpo de las solicitudes POST y PUT
app.use(express.json());

// Archivos estáticos (HTML, CSS, JS, imágenes, etc.)
app.use(express.static(path.join(__dirname, 'proyectofinalcilsa')));

// fs.readFile(filePath,(err,content)=>{
//     if(err){
//         if (err.code === 'ENOENT'){ //Archivo no encontrado
//             fs.readFile(path.join(__dirname,'proyectofinalcilsa',''), (err, content)=>{
//                 res.writeHead(404,{'Content-Type': 'text/html'});
//                 res.end(content, 'utf-8');
//             });
//         } else {
//             res.writeHead(500);
//             res.end('Server Error: ${err.code}');
//         }
//     } else {
//         res.writeHead(200, {'Content-Type': contentType});
//         res.end(content, 'utf-8');
//     }
//     });

const LIST = [];
let id = 0;

    // Endpoint para obtener todas las tareas
app.get('/tareas', (req, res) => {
    res.json(LIST);
});

// Endpoint para agregar una nueva tarea
app.post('/tareas', (req, res) => {
    const { name } = req.body;
    const newTask = { name, id: id++, realizado: false, eliminado: false };
    LIST.push(newTask);
    res.status(201).json(newTask);
});

// Endpoint para actualizar una tarea
app.put('/tareas/:id', (req, res) => {
    const { id } = req.params;
    const { name, realizado } = req.body;
    const task = LIST.find(task => task.id == id);
    if (task) {
        task.name = name;
        task.realizado = realizado;
        res.json(task);
    } else {
        res.status(404).send('Tarea no encontrada');
    }
});

// Endpoint para eliminar una tarea
app.delete('/tareas/:id', (req, res) => {
    const { id } = req.params;
    const index = LIST.findIndex(task => task.id == id);
    if (index !== -1) {
        LIST.splice(index, 1);
        res.status(204).send();
    } else {
        res.status(404).send('Error');
    }
});

// Ruta principal que envía el archivo HTML al navegador
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'proyectofinalcilsa', 'index.html'));
});

// Definir el puerto en el que el servidor escuchara
const PORT = 3000;

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`El servidor esta corriendo en  http://localhost:${PORT}`);
});