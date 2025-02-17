const express=require('express');
const router=express.Router();
const Software=require('../models/software');


//get
router.get('/software', isAuthenticated, async(req, res) => {
    const software=new Software();
    const softwares=await software.findAll(req.subject._id);
    res.render('software', {
        softwares
    });
});

//post
router.post('/software/add', isAuthenticated, async(req, res, next) =>{
    const software=new Software(req.body);
    software.subject=req.subject._id;
    await software.insert();
    res.redirect('/software');
});

//editar
router.get('/software/edit/:id', isAuthenticated, async (req, res, next)=>{
    var software=new Software();
    software=await software.findById(req.params.id);
    res.render('edit', {software});
});

router.post('/software/edit/:id', isAuthenticated, async (req, res, next)=>{
    const software=new Software();
    const{id}=req.params;
    await task.update({_id:id}, req.body);
    res.redirect('/software');
});

//borrar
router.get('/software/delete/:id', isAuthenticated, async(req, res, next)=>{
    const software=new Software();
    let{id}=req.params;
    await task.delete(id);
    res.redirect('/software');
});

//buscar
router.get('software/search', isAuthenticated, async(req, res, next)=>{
    const software=new Software();
    let search=req.query.search;
    const softwares=await software.findSearch(search, req.subject._id);
    res.render('software', {
        softwares
    });
});

function isAuthenticated(req, res, next) {
  if(req.isAuthenticated()) {
    return next();
  }

  res.redirect('/')
}
module.exports = router;