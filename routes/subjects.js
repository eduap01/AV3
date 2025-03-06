const express = require('express');
const router = express.Router();
const Subject = require('../models/subject');
const User = require('../models/user');
const Study = require('../models/study');
const mongoose = require('mongoose');

// Middleware de autenticación
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

// GET - Cargar la página de asignaturas
router.get('/', isAuthenticated, async (req, res) => {
  try {
    const user = req.user;

    let subjects;
    if (user.rol === "admin") {
      // Admin ve todas las asignaturas
      subjects = await Subject.find()
        .populate('study')
        .populate('teachers')
        .populate('students');
    } else if (user.rol === "profesor") {
      // Profesor ve solo las asignaturas en las que está asignado
      subjects = await Subject.find({ teachers: user._id })
        .populate('study')
        .populate('teachers')
        .populate('students');
    } else if (user.rol === "alumno") {
      // Alumno ve solo las asignaturas en las que está inscrito
      subjects = await Subject.find({ students: user._id })
        .populate('study')
        .populate('teachers')
        .populate('students');
    } else {
      // Otros roles (si los hay) no ven asignaturas
      subjects = [];
    }

    // Obtener listas de profesores y alumnos para el formulario
    const teachers = await User.find({ rol: "profesor" });
    const students = await User.find({ rol: "alumno" });
    const studies = await Study.find();

    // Renderizar la vista con los datos
    res.render('subjects', {
      subjects,
      teachers,
      students,
      studies,
      user
    });
  } catch (error) {
    console.error("Error al obtener las asignaturas:", error);
    res.status(500).send("Error interno del servidor");
  }
});

// POST - Crear una nueva asignatura
router.post('/subjects/add', isAuthenticated, async (req, res) => {
  try {
    const { name, grade, description, teachers, students, study } = req.body;

    // Asegurarse de que teachers y students sean arrays
    const teacherIds = Array.isArray(teachers) ? teachers : teachers ? [teachers] : [];
    const studentIds = Array.isArray(students) ? students : students ? [students] : [];

    // Crear una nueva asignatura
    const newSubject = new Subject({
      name,
      grade,
      description,
      study,
      teachers: teacherIds,
      students: studentIds
    });

    // Guardar la asignatura en la base de datos
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
      .populate('study')
      .populate('teachers')
      .populate('students');

    if (!subject) {
      return res.render('edit_subject', { subject: {}, teachers: [], students: [], studies: [] });
    }

    // Obtener todos los profesores y alumnos
    const teachers = await User.find({ rol: 'profesor' });
    const students = await User.find({ rol: 'alumno' });
    const studies = await Study.find();

    // Renderizar la vista de edición con los datos
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

    // Asegurarse de que teachers y students sean arrays
    const teacherIds = Array.isArray(teachers) ? teachers : teachers ? [teachers] : [];
    const studentIds = Array.isArray(students) ? students : students ? [students] : [];

    // Convertir los valores a ObjectId
    const teacherObjectIds = teacherIds.map(teacherId => new mongoose.Types.ObjectId(teacherId));
    const studentObjectIds = studentIds.map(studentId => new mongoose.Types.ObjectId(studentId));

    // Actualizar la asignatura
    await Subject.findByIdAndUpdate(id, {
      name,
      grade,
      description,
      teachers: teacherObjectIds,
      students: studentObjectIds,
      study
    }, { new: true });

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
    const { id } = req.params;
    await Subject.findByIdAndDelete(id);
    res.redirect('/subjects');
  } catch (error) {
    console.error("Error al eliminar la asignatura:", error);
    res.status(500).send("Error al eliminar la asignatura");
  }
});

module.exports = router;