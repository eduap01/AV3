const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StudySchema = Schema({
	name: {
		type: String,
		required: true
	},
	type: {
		type: String,
		required: true
	}
});

StudySchema.methods.findAll = async function (){
    const Study = mongoose.model("studies", StudySchema);
    return await Study.find({})
    .then(result => {return result})
    .catch(error => console.log(error));
    }

StudySchema.methods.insert= async function (){
	await this.save()
	.then (result => console.log(result))
	.catch (error => console.log(error))
};

StudySchema.methods.update= async (id, study) => {
	const Study = mongoose.model("studies", StudySchema);
	await Study.updateOne({_id: id}, study)
	.then (result => console.log(result))
	.catch (error => console.log(error))
};

StudySchema.methods.delete= async function (id) {
	const Study = mongoose.model("studies", StudySchema);
	await Study.deleteOne({_id: id})
	.then (result => console.log(result))
	.catch (error => console.log(error))
};

StudySchema.methods.findById= async function (id) {
	const Study = mongoose.model("studies", StudySchema);
	return await Study.findById(id)
	.then (result => {return result})
	.catch (error => console.log(error));
}

module.exports = mongoose.model('studies', StudySchema);
