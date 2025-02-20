const router = require('express').Router();
const passport = require('passport');
const User = require('../models/user')

/*router.get('/', (req, res, next) => {
  res.render('index');
});*/

router.get('/signin', (req, res, next) => {
  res.render('signin');
});

router.post('/signin', passport.authenticate('local-signin', {
  successRedirect: '/profile',
  failureRedirect: '/signin',
  failureFlash: true
}));

router.get('/profile',isAuthenticated, (req, res, next) => {
  res.render('profile');
});

router.get('/logout', (req, res, next) => {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

//obtener todos los usuarios
router.get('/users', isAuthenticated, async (req, res) =>{
    const users = await User.find();
    res.render('users', {users});

})

/*-------añadir,modificar,eliminar usuarios---------*/

router.post('/users/add', isAuthenticated,async (req, res, next) => {
  const user = new User(req.body);
  user.usuario=req.user._id;
  await user.save();
  res.redirect('/users');
});

/*router.get('/users/turn/:id',isAuthenticated, async (req, res, next) => {
  let { id } = req.params;
  const user = await User.findById(id);
  user.status = !user.status;
  await user.insert();
  res.redirect('/users');
});*/


router.get('/users/edit/:id', isAuthenticated, async (req, res) => {

  const user = await user.findById(req.params.id);
  res.render('edit_user', { user });
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
        password = user.encryptPassword(password); // Encripta la nueva contraseña
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

  module.exports = router;





/*
  router.post('/studies/edit/:id', isAuthenticated, async (req, res) => {
    const { name, type } = req.body;
    await Study.findByIdAndUpdate(req.params.id, { name, type });
    res.redirect('/studies');
  });*/

router.get('/users/delete/:id', isAuthenticated,async (req, res, next) => {
  const user = new User();
  let { id } = req.params;
  await user.delete(id);
  res.redirect('/users');
});

router.get('/users/search',isAuthenticated, async (req, res, next) => {
  const user = new User();
  let search = req.query.search;
  const users = await user.findSearch(search, req.user._id);
  res.render('users', {
    users
  });
});


function isAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }

  res.redirect('/')
}

module.exports = router;
