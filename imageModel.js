const mongoose =require("mongoose");

const imgSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        data:Buffer,
        contentType:String
    },
    brand:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
})


const image=mongoose.model("image",imgSchema);

module.exports=image;