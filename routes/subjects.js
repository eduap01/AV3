const express = require('express');
const router = express.Router();
const Subject = require('../models/subject');
const User = require('../models/user'); // Ahora usamos el modelo User para manejar profesores y alumnos
const Study = require('../models/study');
// GET - Cargar la página de asignaturas con todos los profesores y estudiantes
router.get('/subjects', isAuthenticated, async (req, res) => {
    try {
        // Obtener todas las asignaturas con los usuarios (profesores y alumnos)
        const subjects = await Subject.find();
        // Obtener todos los profesores y alumnos desde el modelo User
        const teachers = await User.find({ rol: 'profesor' });
        const students = await User.find({ rol: 'alumno' });
        const studies = await Study.find();

        // Renderizar la vista y pasar los datos
        res.render('subjects', { subjects, description, teachers, students, studies });
    } catch (error) {
        console.error("Error al obtener los datos:", error);
        res.status(500).send("Error interno del servidor");
    }
});

// POST - Crear una nueva asignatura
router.post('/subjects/add', isAuthenticated, async (req, res) => {
    try {
        // Extraer datos del formulario (profesores y alumnos seleccionados)
        const { name, grade, description, teachers, students, study } = req.body;

        // Crear una nueva asignatura con los datos del formulario
        const newSubject = new Subject({
            name,
            grade,
            description,
            study,
            teachers: teachers || [],
            students: students || []
        });

        // Guardar la nueva asignatura en la base de datos
        await newSubject.save();

        // Redirigir a la página de asignaturas
        res.redirect('/subjects');
    } catch (error) {
        console.error("Error al agregar la asignatura:", error);
        res.status(500).send("Error al agregar la asignatura");
    }
});

// GET - Cargar la página para editar una asignatura
router.get('/subjects/edit/:id', isAuthenticated, async (req, res) => {
    try {
        // Obtener la asignatura que se va a editar
        const subject = await Subject.findById(req.params.id).populate('teachers students');

        // Obtener todos los profesores y alumnos
        const teachers = await User.find({ rol: 'profesor' });
        const students = await User.find({ rol: 'alumno' });

        // Renderizar la vista de edición y pasar los datos
        res.render('edit', { subject, teachers, students });
    } catch (error) {
        console.error("Error al cargar la asignatura para editar:", error);
        res.status(500).send("Error al cargar la asignatura para editar");
    }
});

// POST - Actualizar la asignatura editada
router.post('/subjects/edit/:id', isAuthenticated, async (req, res) => {
    try {
        const { name, grade, description, teachers, students } = req.body;

        // Actualizar los datos de la asignatura
        await Subject.findByIdAndUpdate(req.params.id, {
            name,
            grade,
            description,
            teachers: teachers || [],
            students: students || [],
            study
        });

        // Redirigir a la página de asignaturas
        res.redirect('/subjects');
    } catch (error) {
        console.error("Error al actualizar la asignatura:", error);
        res.status(500).send("Error al actualizar la asignatura");
    }
});

// GET - Eliminar una asignatura
router.get('/subjects/delete/:id', isAuthenticated, async (req, res) => {
    try {
        // Eliminar la asignatura
        await Subject.findByIdAndDelete(req.params.id);

        // Redirigir a la página de asignaturas
        res.redirect('/subjects');
    } catch (error) {
        console.error("Error al eliminar la asignatura:", error);
        res.status(500).send("Error al eliminar la asignatura");
    }
});

// Middleware de autenticación
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

module.exports = router;
