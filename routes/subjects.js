const express = require('express');
const router = express.Router();
const Subject = require('../models/subject');
const User = require('../models/user'); // Ahora usamos el modelo User para manejar profesores y alumnos
const Study = require('../models/study');
const mongoose = require('mongoose');

// GET - Cargar la página de asignaturas con todos los profesores y estudiantes
router.get('/subjects', isAuthenticated, async (req, res) => {
    try {
        // Obtener todas las asignaturas con los usuarios (profesores y alumnos)
        const subjects = await Subject.find(). populate('study');
        // Obtener todos los profesores y alumnos desde el modelo User
        const teachers = await User.find({ rol: 'profesor' });
        const students = await User.find({ rol: 'alumno' });
        const studies = await Study.find();

        // Renderizar la vista y pasar los datos
        res.render('subjects', { subjects, teachers, students, studies });
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
        const subjectId = req.params.id;

        // Buscar la asignatura y poblar relaciones
        const subject = await Subject.findById(subjectId)
            .populate('students')
            .populate('teachers')
            .populate('study');

        if (!subject) {
            return res.render('edit_subject', { subject: {}, teachers: [], students: [], studies: [] });
        }

        // Obtener todos los usuarios con rol de profesor y alumno usando los valores reales
        const teachers = await User.find({ rol: 'profesor' });
        const students = await User.find({ rol: 'alumno' });
        const studies = await Study.find();

        console.log("Subject:", subject);
                console.log("Teachers:", teachers);
                console.log("Students:", students);
                console.log("Studies:", studies);

        res.render('edit_subject', { subject, teachers, students, studies });
    } catch (error) {
        console.error("Error al cargar la asignatura para editar:", error);
        res.render('edit_subject', { subject: {}, teachers: [], students: [], studies: [] });
    }
});


// POST - Actualizar la asignatura editada
router.post('/subjects/edit/:id', isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        let { name, grade, description, teachers, students, study } = req.body;

        // Asegurarse de que teachers y students sean arrays válidos
        const teacherIds = Array.isArray(teachers) ? teachers : teachers ? [teachers] : [];
        const studentIds = Array.isArray(students) ? students : students ? [students] : [];

        // Convertir los valores de teachers y students a ObjectId usando new
        const teacherObjectIds = teacherIds.map(teacherId => new mongoose.Types.ObjectId(teacherId)); // <-- Agrega new
        const studentObjectIds = studentIds.map(studentId => new mongoose.Types.ObjectId(studentId)); // <-- Agrega new

        // Actualizar los datos de la asignatura
        await Subject.findByIdAndUpdate(id, {
            name,
            grade,
            description,
            teachers: teacherObjectIds,
            students: studentObjectIds,
            study
        }, { new: true });

        res.redirect('/subjects');
    } catch (error) {
        console.error("Error al actualizar la asignatura:", error);
        res.status(500).send("Error al actualizar la asignatura");
    }
});

//


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
