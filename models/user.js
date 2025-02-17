const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const { Schema } = mongoose;

const userSchema = new Schema({
  email:  { type: String, required: true },
  password:  { type: String, required: true },
  rol: { type: String, required: true },
  name: { type: String, required: true },
  surname: { type: String, required: true },
  subjects: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }]

});

userSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

userSchema.methods.comparePassword= function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};
userSchema.methods.comparePassword= function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.findEmail= async (email) => {
  const User = mongoose.model("user", userSchema);
  return  await User.findOne({'email': email})
  .then(result => {return result})
  .catch(error => console.log(error));

};


//insertar
userSchema.methods.insert= async function () {
  await this.save()
  .then(result => console.log(result))
  .catch(error => console.log(error));
};
module.exports = mongoose.model('user', userSchema);

//borrar
userSchema.methods.delete= async function (id) {
  const User = mongoose.model("users", userSchema);
  await User.deleteOne({_id: id})
  .then(result => console.log(result))
  .catch(error => console.log(error));
};

//update
userSchema.statics.updateEmailById = async function (id, body/*porque cojo todo el body al actualizar*/) {
  return await this.updateOne({ _id: id }, { body })
     .then(result => console.log(result))
     .catch(error => console.log(error));
};

//finbyID
userSchema.methods.findById= async function (id) {
  const User = mongoose.model("users", userSchema);
  return await User.findById(id)
   .then(result => console.log(result))
   .catch(error => console.log(error));
};

//findbyAsignaturasporUsuario
userSchema.statics.findBySubjectName = async function (subjectName) {
  return await this.find({ 'subjects.nombre': new RegExp(subjectName, 'i') })
     .then(result => console.log(result))
     .catch(error => console.log(error));
};

const User = mongoose.model('user', userSchema);

module.exports = User;


