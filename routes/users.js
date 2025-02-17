const router = require('express').Router();
const passport = require('passport');

router.get('/', (req, res, next) => {
  res.render('index');
});

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

/*-------añadir,modificar,eliminar usuarios---------*/

router.post('/users/add', isAuthenticated,async (req, res, next) => {
  const user = new User(req.body);
  user.usuario=req.user._id;
  await user.insert();
  res.redirect('/users');
});

/*router.get('/users/turn/:id',isAuthenticated, async (req, res, next) => {
  let { id } = req.params;
  const user = await User.findById(id);
  user.status = !user.status;
  await user.insert();
  res.redirect('/users');
});*/


router.get('/users/edit/:id', isAuthenticated, async (req, res, next) => {
  var user = new User();
  task = await user.findById(req.params.id);
  res.render('edit', { user });
});

router.post('/users/edit/:id',isAuthenticated, async (req, res, next) => {
  const user = new User();
  const { id } = req.params;
  await user.update({_id: id}, req.body);
  res.redirect('/users');
});

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
