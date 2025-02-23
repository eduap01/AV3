const express=require('express');
const router=express.Router();
const Software=require('../models/software');
const Subject = require('../models/subject');
const mongoose = require('mongoose');


//get
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const softwares = await Software.find().populate('subject');
        res.render('softwares', { softwares });
    } catch (error) {
        console.error("Error al obtener softwares:", error);
        res.status(500).send("Error interno del servidor");
    }
});

//post
router.post('/add', isAuthenticated, async(req, res, next) => {
    try {
        const software = new Software(req.body);
        software.subject = req.body.subject;
        await software.save();
        res.redirect(`/softwares/subject/${req.body.subject}`);
    } catch (error) {
        console.error("Error al agregar software:", error);
        res.status(500).send("Error al agregar software");
    }
});

//editar
router.get('/edit/:id', isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("ID de software no válido");
        }
        const software = await Software.findById(id);
        if (!software) {
            return res.status(404).send("Software no encontrado");
        }
        res.render('edit_softwares', { software });
    } catch (error) {
        console.error("Error al obtener el software para editar:", error);
        res.status(500).send("Error interno del servidor");
    }
});

router.post('/edit/:id', isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const { description, link } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("ID de software no válido");
        }
        const updatedSoftware = await Software.findByIdAndUpdate(
            id,
            { description, link },
            { new: true }
        if (!updatedSoftware) {
            return res.status(404).send("Software no encontrado");
        }
        res.redirect(`/softwares/subject/${updatedSoftware.subject}`);
    } catch (error) {
        console.error("Error al actualizar el software:", error);
        res.status(500).send("Error interno del servidor");
    }
});

//borrar
router.get('/delete/:id', isAuthenticated, async (req, res) => {
    try {
        const { id } = req.params;
        const software = await Software.findById(id);
        if (!software) {
            return res.status(404).send("Software no encontrado");
        }
        //mickeyherramienta que usaremos mas tarde
        const subjectId = software.subject;
        await Software.findByIdAndDelete(id);
        //pimienta (así creo que vuelvo a los softwares de la asignatura que he estado editando)
        res.redirect(`/softwares/subject/${subjectId}`);
    } catch (error) {
        console.error("Error al eliminar el software:", error);
        res.status(500).send("Error interno del servidor");
    }
});

router.get('/subject/:subjectId', isAuthenticated, async (req, res) => {
    try {
        const subjectId = req.params.subjectId;
        if (!mongoose.Types.ObjectId.isValid(subjectId)) {
            return res.status(400).send("ID de asignatura no válido");
        }
        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).send("Asignatura no encontrada");
        }
        const softwares = await Software.find({ subject: subjectId }).populate('subject');
        res.render('softwares', {
            softwares,
            subject: subject,
            user: req.user
        });

    } catch (error) {
        console.error("Error al obtener softwares:", error);
        res.status(500).send("Error interno del servidor");
    }
});


//buscar
router.get('/search', isAuthenticated, async(req, res, next)=>{
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