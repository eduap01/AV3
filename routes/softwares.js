const express=require('express');
const router=express.Router();
const Software=require('../models/software');


//get
router.get('/softwares', isAuthenticated, async (req, res) => {
    try {
        const softwares = await Software.find().populate('subject');
        res.render('softwares', { softwares });
    } catch (error) {
        console.error("Error al obtener softwares:", error);
        res.status(500).send("Error interno del servidor");
    }
});

//post
router.post('/softwares/add', isAuthenticated, async(req, res, next) => {
    try {
        const software = new Software(req.body);
        software.subject = req.body.subject;
        await software.save();
        res.redirect('/softwares');
    } catch (error) {
        console.error("Error al agregar software:", error);
        res.status(500).send("Error al agregar software");
    }
});

//editar
router.get('/softwares/edit/:id', isAuthenticated, async (req, res, next)=>{
    var software=new Software();
    software=await software.findById(req.params.id);
    res.render('edit', {software});
});

router.post('/softwares/edit/:id', isAuthenticated, async (req, res, next)=>{
    const software=new Software();
    const{id}=req.params;
    await software.update(id, req.body);
    res.redirect('/softwares');
});

//borrar
router.get('/softwares/delete/:id', isAuthenticated, async(req, res, next)=>{
    const software=new Software();
    let{id}=req.params;
    await software.delete(id);
    res.redirect('/softwares');
});

// Ruta para listar softwares por asignatura
router.get('/subject/:subjectId', isAuthenticated, async (req, res) => {
    try {
        const subjectId = req.params.subjectId;
        const softwares = await Software.find({ subject: subjectId }).populate('subject');

        // Se envía la variable subject para que la vista la pueda usar (por ejemplo, en un campo oculto)
        res.render('softwares', { softwares, subject: { _id: subjectId } });
    } catch (error) {
        console.error("Error al obtener softwares:", error);
        res.status(500).send("Error interno del servidor");
    }
});


//buscar
router.get('/softwares/search', isAuthenticated, async(req, res, next)=>{
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