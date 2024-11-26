const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../db/data.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('Conectado a la base de datos SQLite');
    }
});

const all = (req, res) => {
    const sql = 'SELECT * FROM notas';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
};

const run = (req, res) => {
    const { tarea } = req.body;
    if (!tarea) {
        res.status(400).json({ error: 'La tarea es requerida' });
        return;
    }

    const sql = 'INSERT INTO notas (tarea) VALUES (?)';
    const params = [tarea];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'Nota creada con éxito',
            data: { id_tarea: this.lastID, titulo }
        });
    });
};

// Este podría ser el codigo para eliminar
const del = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM notas WHERE id_tarea = ?';
    const params = [id];

    db.run(sql, params, function (err) {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: `Nota con ID ${id} eliminado` });
    });
};

module.exports = { all, run, del };