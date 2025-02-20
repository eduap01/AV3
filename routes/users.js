const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user');

// Página de inicio de sesión
router.get('/signin', (req, res) => {
  res.render('signin');
});

router.post('/signin', passport.authenticate('local-signin', {
  successRedirect: '/profile',
  failureRedirect: '/signin',
  failureFlash: true
}));

// Perfil del usuario
router.get('/profile', isAuthenticated, (req, res) => {
  res.render('profile');
});

// Cerrar sesión
router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

// Obtener todos los usuarios
router.get('/users', isAuthenticated, async (req, res) => {
  try {
    const users = await User.find();
    res.render('users', { users });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener los usuarios');
  }
});

// Añadir un usuario
router.post('/users/add', isAuthenticated, async (req, res) => {
  try {
    const user = new User(req.body);
    user.password = user.encryptPassword(user.password);
    user.usuario = req.user._id;
    await user.save();
    res.redirect('/users');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar el usuario');
  }
});

// Editar usuario
router.get('/users/edit/:id', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('Usuario no encontrado');
    }
    res.render('edit_user', { user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al obtener el usuario para edición');
  }
});

router.post('/users/edit/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    let { email, password, rol, name, surname, subjects } = req.body;

    if (password) {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).send('Usuario no encontrado');
      }
      password = user.encryptPassword(password);
    }

    await User.findByIdAndUpdate(id, {
      email,
      password,
      rol,
      name,
      surname,
      subjects
    }, { new: true });

    res.redirect('/users');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar el usuario');
  }
});

// Eliminar usuario
router.get('/users/delete/:id', isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.redirect('/users');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar el usuario');
  }
});

// Buscar usuarios
router.get('/users/search', isAuthenticated, async (req, res) => {
  try {
    const search = req.query.search;
    const users = await User.find({
      $or: [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') }
      ]
    });
    res.render('users', { users });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en la búsqueda de usuarios');
  }
});

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

module.exports = router;
