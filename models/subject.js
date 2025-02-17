const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubjectSchema = new Schema({
    name: { type: String, required: true },
    grade: { type: String, required: true },
    students: [{ type: Schema.Types.ObjectId, ref: 'Student' }], // Relación con estudiantes
    teachers: [{ type: Schema.Types.ObjectId, ref: 'Teacher' }], // Relación con profesores
    study: { type: Schema.Types.ObjectId, ref: 'Study', required: true } // Relación con un área de estudio
});

// Insertar un Subject
SubjectSchema.methods.insert = async function () {
    await this.save()
        .then(result => console.log(result))
        .catch(error => console.log(error));
};

// Eliminar Subject por ID
SubjectSchema.methods.delete = async function (id) {
    const Subject = mongoose.model("subjects", subjectSchema);
    await Subject.deleteOne({ _id: id })
        .then(result => console.log(result))
        .catch(error => console.log(error));
};

// Actualizar el grade de un Subject por ID
SubjectSchema.statics.updateGradeById = async function (id, newGrade) {
    return await this.updateOne({ _id: id }, { grade: newGrade })
        .then(result => console.log(result))
        .catch(error => console.log(error));
};

// Buscar Subject por ID
SubjectSchema.methods.findById = async function (id) {
    const Subject = mongoose.model("subjects", subjectSchema);
    return await Subject.findById(id)
        .then(result => console.log(result))
        .catch(error => console.log(error));
};

// Buscar asignaturas por ID de estudiante
SubjectSchema.statics.findByStudentId = async function (studentId) {
    return await this.find({ students: studentId })
        .populate('teachers study')
        .then(result => console.log(result))
        .catch(error => console.log(error));
};

// Buscar asignaturas por ID de profesor
SubjectSchema.statics.findByTeacherId = async function (teacherId) {
    return await this.find({ teachers: teacherId })
        .populate('students study')
        .then(result => console.log(result))
        .catch(error => console.log(error));
};

SubjectSchema.statics.findAll = async function () {
    return await this.find()
        .populate('students teachers study')
        .then(result => console.log(result))
        .catch(error => console.log(error));
};

SubjectSchema.statics.findSearch = async function (searchTerm) {
    return await this.find({ name: new RegExp(searchTerm, 'i') })
        .populate('students teachers study')
        .then(result => console.log(result))
        .catch(error => console.log(error));
};

const Subject = mongoose.model('Subject', SubjectSchema);
module.exports = Subject;