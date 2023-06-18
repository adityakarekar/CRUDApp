const express=require("express")
const bodyParser=require("body-parser");
const ejs=require("ejs");
const { default: mongoose } = require("mongoose");
const multer=require("multer");
const fs=require("fs");
const path=require("path");

//local imports
const image=require("./imageModel");


const app=express();
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());
app.set("view engine","ejs");
app.use(express.static("public"));

//creating a mongodb connection using mongoose
mongoose.connect("mongodb://127.0.0.1:27017/dataDB")
.then(()=>{console.log("connection to the server is successfull")})
.catch((err)=>{console.log(err)});

// const dataSchema=new mongoose.Schema({
//     name:String,
//     address:String
// })

// const data=new mongoose.model("data",dataSchema);

//creating storage for the files to be stored
const Storage=multer.diskStorage({
    destination:"uploads",
    filename:(req,file,callBack)=>{
        callBack(null,file.originalname)
    }
})

//creating the middleware function to store the image
const upload=multer({
    storage:Storage
}).single("testImg")


//all the necessary routes are defined here
app.get("/",(req,res)=>{
    image.find()
    .then((imgData)=>{
        res.render("home",{img:imgData})
    })

})

app.get("/create",(req,res)=>{
    res.render("create");
    //res.redirect("/")
})


//creating a route to upload the image to the mongodb
app.post("/create",(req,res)=>{
    upload(req,res,(err)=>{
        if(err)
            console.log(err)
        else{
            const newImage=new image({
                name:req.body.name,
                image:{
                    data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                    contentType:"image/png"
                },
                brand:req.body.brand,
                description:req.body.description,
                category:req.body.category
                
            })

            newImage.save()
            .then(()=>{
                //alert("image uplodaed successfully");
                res.redirect("/");
            })
            .catch((err)=>{console.log(err)})
        }
    })
})

//getting productData against a specific id and viewing it
app.get("/view/:id",(req,res)=>{
    const productId=req.params.id.toString().trim();
    image.findById({_id:productId})
    .then((data)=>{
        res.render("viewData",{productData:data})
    })
    .catch((err)=>{console.log(err)})
})



//updating the data against a specific id
app.get("/edit/:id",(req,res)=>{
    const productId=req.params.id.toString().trim();
    image.findById(productId)
    .then((data)=>{
        res.render("edit",{productData:data})
        //console.log(data.description);
    })
})


//creating the route to update the data
 
app.post("/edit/:id",(req,res)=>{
    upload(req,res,(err)=>{
        if(err)
            console.log(err)
        else{
            const productId=req.params.id.toString().trim();
            console.log(productId);
            image.findByIdAndUpdate( productId,{
                name:req.body.name,
                image:{
                    data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                    contentType:"image/png"
                },
                brand:req.body.brand,
                description:req.body.description,
                category:req.body.category
                
            })
            .then(()=>{
                console.log("data updated successfully");
                res.redirect("/");
            
            })
            .catch((err)=>{console.log(err)})
        }
    })
   
})


//deleting the product against a specific id
app.get("/delete/:id",(req,res)=>{
    upload(req,res, (err)=>{
        if(err)
            console.log(err)
        else{
            const deleteId=req.params.id.toString().trim()
            image.findByIdAndDelete(deleteId)
            .then(()=>{
               //res.send("data deleted successfully");
               res.redirect("/");
            })
            .catch((err)=>{console.log(err)});
        }
    })
})

app.listen(5000,()=>{
    console.log("App running on port 5000");
})
