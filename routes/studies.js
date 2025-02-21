const express = require('express');
const router = express.Router();
const Study = require('../models/study');

// Obtener todos los estudios
router.get('/studies', isAuthenticated, async (req, res) => {
  const studies = await Study.find();
  res.render('studies', { studies });
});

// Agregar un nuevo estudio
router.post('/studies/add', isAuthenticated, async (req, res) => {
  const { name, type } = req.body;
  const newStudy = new Study({ name, type });
  await newStudy.save();
  res.redirect('/studies');
});

// Editar estudio
router.get('/studies/edit/:id', isAuthenticated, async (req, res) => {
  const study = await Study.findById(req.params.id);

  res.render('edit_study', { study });
});

router.post('/studies/edit/:id', isAuthenticated, async (req, res) => {
  const { name, type } = req.body;
  await Study.findByIdAndUpdate(req.params.id, { name, type });
  res.redirect('/studies');
});

// Eliminar estudio
router.get('/studies/delete/:id', isAuthenticated, async (req, res) => {
  await Study.findByIdAndDelete(req.params.id);
  res.redirect('/studies');
});

// Buscar estudios
router.get('/studies/search', isAuthenticated, async (req, res) => {
  const search = req.query.search;
  const studies = await Study.find({ name: new RegExp(search, 'i') });
  res.render('studies', { studies });
});

// Middleware de autenticación
function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;
