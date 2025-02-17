const express=require('express');
const router=express.Router();
const Subject=require('../models/subject');


//get
router.get('/subject', isAuthenticated, async(req, res) => {
    const subject=new Subject();
    const subjects=await subject.findAll(req.subject._id);
    res.render('subjects', {
        subjects
    });
});

//post
router.post('/subject/add', isAuthenticated, async(req, res, next) =>{
    const subject=new Subject(req.body);
    subject.subject=req.subject._id;
    await subject.insert();
    res.redirect('/subject');
});

//editar
router.get('/subject/edit/:id', isAuthenticated, async (req, res, next)=>{
    var subject=new Subject();
    subject=await subject.findById(req.params.id);
    res.render('edit', {subject});
});

router.post('/subject/edit/:id', isAuthenticated, async (req, res, next)=>{
    const subject=new Subject();
    const{id}=req.params;
    await task.update({_id:id}, req.body);
    res.redirect('/subject');
});

//borrar
router.get('/subject/delete/:id', isAuthenticated, async(req, res, next)=>{
    const subject=new Subject();
    let{id}=req.params;
    await task.delete(id);
    res.redirect('/subject');
});

//buscar
router.get('subject/search', isAuthenticated, async(req, res, next)=>{
    const subject=new Subject();
    let search=req.query.search;
    const subjects=await subject.findSearch(search, req.subject._id);
    res.render('subject', {
        subjects
    });
});

function isAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }

  res.redirect('/')
}
module.exports = router;