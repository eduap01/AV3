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

        // Verifica que el ID sea un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("ID de software no válido");
        }

        // Busca el software por su ID
        const software = await Software.findById(id);
        if (!software) {
            return res.status(404).send("Software no encontrado");
        }

        // Renderiza la vista de edición con los datos del software
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

        // Verifica que el ID sea un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("ID de software no válido");
        }

        // Actualiza el software
        const updatedSoftware = await Software.findByIdAndUpdate(
            id,
            { description, link },
            { new: true } // Devuelve el documento actualizado
        );

        if (!updatedSoftware) {
            return res.status(404).send("Software no encontrado");
        }

        // Redirige a la lista de softwares de la asignatura
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

        // 1. Busca el software por su ID para obtener el subjectId
        const software = await Software.findById(id);
        if (!software) {
            return res.status(404).send("Software no encontrado");
        }

        // 2. Guarda el subjectId antes de eliminar el software
        const subjectId = software.subject;

        // 3. Elimina el software
        await Software.findByIdAndDelete(id);

        // 4. Redirige a la lista de softwares de la asignatura
        res.redirect(`/softwares/subject/${subjectId}`);
    } catch (error) {
        console.error("Error al eliminar el software:", error);
        res.status(500).send("Error interno del servidor");
    }
});

router.get('/subject/:subjectId', isAuthenticated, async (req, res) => {
    try {
        const subjectId = req.params.subjectId;

        // 1. Validar que el ID es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(subjectId)) {
            return res.status(400).send("ID de asignatura no válido");
        }

        // 2. Verificar si la asignatura existe
        const subject = await Subject.findById(subjectId);
        if (!subject) {
            return res.status(404).send("Asignatura no encontrada");
        }

        // 3. Buscar softwares asociados (puede devolver un array vacío)
        const softwares = await Software.find({ subject: subjectId }).populate('subject');

        // 4. Renderizar la vista incluso si no hay softwares
        res.render('softwares', {
            softwares,
            subject: subject, // Envía el objeto completo de la asignatura
            user: req.user // Asegúrate de enviar el usuario si la vista lo necesita
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