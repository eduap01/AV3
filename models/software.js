const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SoftwareSchema=Schema({
    description:{
        type: String,
        required: true
    },

    link:{
        type: String,
        required: true,
    },

    subject:[
        {type:mongoose.Schema.Types.ObjectId, ref:'subject'}
    ]
});

SoftwareSchema.methods.findAll=async function (subject){
    const Software =mongoose.model("software", SoftwareSchema);
    return await Software.find({'subject':subject})
    .then(result => {return result})
    .catch(error => console.log(error));
};

SoftwareSchema.methods.insert= async function(){
    //await this.save();
    await this.save()
    .then(result=> console.log(result))
    .catch(error=>console.log(error));
};

SoftwareSchema.methods.update=async (id , software) =>{
    const Software = mongoose.model("software", SoftwareSchema);
    await Software.updateOne({_id:id}, software)
    .then(result=>console.log(result))
    .catch(error=>console.log(error));
};

SoftwareSchema.methods.delete=async function(id){
    const Software=mongoose.model("software", SoftwareSchema);
    await Software.deleteOne({_id:id})
    .then(result=>console.log(result))
    .catch(error=>console.log(error));
};

SoftwareSchema.methods.findById= async function (id){
    const Software=mongoose.model("software", SoftwareSchema);
    return await Software.findById(id)
    .then(result=>{return result})
    .catch(error=>console.log(error));
};

SoftwareSchema.methods.findSearch=async function(search, subject){
    const Software=mongoose.model("software", SoftwareSchema);
    return await Software.find({'description':new RegExp(search, 'i'), 'subject': subject})
    .then(result => {return result})
    .catch(error=> console.log(error));
};

module.exports=mongoose.model('software', SoftwareSchema);

//RRRRRRR