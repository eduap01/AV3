const express = require('express');
const router = express.Router();
const Study = require('../models/study')

router.get('/studies', isAuthenticated, async(req, res) =>{
    const study = new Study();
    const studies = await study.findAll(req.user._id);
    res.render('studies', {studies : studies
    });
});

router.post('/studies/add', isAuthenticated, async (req, res, next) =>{
    const study = new Study(req.body);
    task.usuario=req.user._id;
    await study.insert();
    res.redirect('/studies');
});

router.get('/studies/turn/:id', isAuthenticated, async (req, res, next) => {
    let {id} = req.params;
    const study = await Study.findById(id);
    study.status=!study.status;
    await study.insert();
    res.redirect('/studies');
})

router.get('/studies/edit/:id', isAuthenticated, async (req, res, next) => {
    let study = new Study();
    study = await study.findById(req.params.id);
    res.render('edit', {study});
});

router.post('/studies/edit/:id', isAuthenticated, async (req, res, next) => {
    const study = new Study();
    let {id} = req.params;
    await study.update({_id: id}, req.body);
    res.redirect('/studies');
});

router.get('/studies/delete/:id', isAuthenticated, async (req, res, next)=> {
    const study = new Study();
    let {id} = req.params;
    await study.delete(id);
    res.redirect('/studies');
});

router.get('/studies/search', isAuthenticated, async (req, res, next) => {
    const study = new Study();
    let search = req.query.search;
    const studies = await study.findSearch(search, req.user._id);
    res.render('studies', {
        studies
    });
});

function isAuthenticated(req, res, next){
    if(req.isAuthenticated()) {
        return next();
    }

    res.redirect('/')
}
module.exports = router;