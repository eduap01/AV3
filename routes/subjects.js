const express = require('express');
const router = express.Router();
const Subject = require('../models/subject');
const User = require('../models/user'); // Ahora usamos el modelo User para manejar profesores y alumnos
const Study = require('../models/study');

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

        // Buscar la asignatura y poblar los usuarios con rol "profesor" y "alumno"
        const subject = await Subject.findById(subjectId)
            .populate({
                path: 'students', // Poblar alumnos
            })
            .populate({
                path: 'teachers', // Poblar profesores
            })
            .populate('study'); // Poblar estudio

        // Si no se encuentra la asignatura, mostrar la vista con datos vacíos
        if (!subject) {
            return res.render('edit_subject', { subject: {}, teachers: [], students: [], studies: [] });
        }

        // Obtener todos los usuarios con rol de profesor y alumno para los selects
        const teachers = await User.find({ rol: 'Teacher' });
        const students = await User.find({ rol: 'Student' });
        const studies = await Study.find();

        // Renderizar la vista de edición con los datos de la asignatura
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

        // Convertir los valores de teachers y students a ObjectId
        const teacherObjectIds = teacherIds.map(teacherId => mongoose.Types.ObjectId(teacherId));
        const studentObjectIds = studentIds.map(studentId => mongoose.Types.ObjectId(studentId));

        // Actualizar los datos de la asignatura
        await Subject.findByIdAndUpdate(id, {
            name,
            grade,
            description,
            teachers: teacherObjectIds,  // Actualiza los profesores como ObjectIds
            students: studentObjectIds,  // Actualiza los alumnos como ObjectIds
            study  // Actualiza el estudio
        }, { new: true });

        // Redirigir a la página de asignaturas después de la actualización
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
