const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubjectSchema = new Schema({
    name: { type: String, required: true },
    grade: { type: String, required: true },
    students: [{ type: Schema.Types.ObjectId, ref: 'Student' }], // Relación con estudiantes
    teachers: [{ type: Schema.Types.ObjectId, ref: 'Teacher' }], // Relación con profesores
    study: { type: Schema.Types.ObjectId, ref: 'Study', required: true } // Relación con un área de estudio
});

// Método para insertar un Subject
SubjectSchema.methods.insert = async function () {
    try {
        const result = await this.save();
        console.log("Insertado:", result);
        return result;
    } catch (error) {
        console.error("Error al insertar:", error);
        throw error;
    }
};

// Método estático para eliminar un Subject por ID
SubjectSchema.statics.deleteById = async function (id) {
    try {
        const result = await this.findByIdAndDelete(id);
        console.log("Eliminado:", result);
        return result;
    } catch (error) {
        console.error("Error al eliminar:", error);
        throw error;
    }
};

// Método estático para actualizar datos de un Subject
SubjectSchema.statics.updateById = async function (id, newData) {
    try {
        const result = await this.findByIdAndUpdate(id, newData, { new: true });
        console.log("Actualizado:", result);
        return result;
    } catch (error) {
        console.error("Error al actualizar:", error);
        throw error;
    }
};

// Método estático para buscar por ID
SubjectSchema.statics.findById = async function (id) {
    try {
        return await this.findOne({ _id: id }).populate('students teachers study');
    } catch (error) {
        console.error("Error al buscar por ID:", error);
        throw error;
    }
};

// Método estático para buscar todas las materias
SubjectSchema.statics.findAll = async function () {
    try {
        return await this.find().populate('students teachers study');
    } catch (error) {
        console.error("Error al obtener todas las materias:", error);
        throw error;
    }
};

// Método estático para buscar materias por término
SubjectSchema.statics.findSearch = async function (searchTerm) {
    try {
        return await this.find({ name: new RegExp(searchTerm, 'i') }).populate('students teachers study');
    } catch (error) {
        console.error("Error al buscar materias:", error);
        throw error;
    }
};

const Subject = mongoose.model('Subject', SubjectSchema);
module.exports = Subject;
