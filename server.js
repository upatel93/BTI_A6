/*************************************************************************
* BTI325– Assignment 2
* I declare that this assignment is my own work in accordance with Seneca Academic
Policy. No part * of this assignment has been copied manually or electronically from any
other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: _Ujjval Patel_ Student ID: _153763214_ Date: _October 08, 2022_
*
* Your app’s URL (from Cyclic) : __https://calm-pink-hippo-ring.cyclic.app/__
*
*************************************************************************/ 

const express = require("express"); //Inclusion of Express module
const path = require("path"); // Inclusion of Path Module for sending file with correct path.
const multer = require("multer"); // inclusion of multer module.
const fileSystem = require('fs'); // including for reading files
const dataService = require('./data-service.js'); // Inclusion of data-service module
const app = express(); // making app for server functioning

let port = process.env.PORT || 8080; // Port defining 

app.use(express.json());
app.use(express.urlencoded({extended: true}));

function httpStart(){  // logging Port on console for debugging purpose.
console.log(`Express http server listening on port: ${port}`);
};


const storage = multer.diskStorage({
  destination: "./public/images/uploaded",
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Professor will discuss in class
// This will use public folder as root folder for all the static objects like
// picutres, videos etc to be displayed on app webpages.
app.use(express.static('public'));

// responding to default "/" home route
app.get("/",(request,response)=>{
    response.sendFile(path.join(__dirname,"/views/home.html"));
});

// responding to "/about" route
app.get("/about",(request,response)=>{
    response.sendFile(path.join(__dirname,"/views/about.html"));
});

// responding to "/departments" route
app.get("/departments",(request,response)=>{
    dataService.getDepartments().then(function(data){
        response.json(data);
    });
});

// responding to "/managers" route
app.get("/managers",(request,response)=>{
    dataService.getManagers().then(function(data){
        response.json(data);
    });
});

// responding to "/employees" route
app.get("/employees",(request,response)=>{
    dataService.getAllEmployees().then((data) => {
        response.json(data);
      });
});


// responding to "/employees/add"" route
app.get("/employees/add",(request,response)=>{
  response.sendFile(path.join(__dirname,"/views/addEmployee.html"));
});

// responding to "/images/add"" route
app.get("/images/add",(request,response)=>{
  response.sendFile(path.join(__dirname,"/views/addImage.html"));
});

// post route for redirecting and using middleware
app.post("/images/add", upload.single("imageFile"), function(request, response){
  response.redirect("/images");
});

// to get the images in json object when responding to "/images" route.
app.get("/images",(request,response)=>{

  fileSystem.readdir("./public/images/uploaded",(error,data)=>{
    if(error){
      console.log(error);
    }
    else{
      response.send(data);
    }

  });
});


app.post("/employees/add",(request,response)=>{

  
  response.redirect("/employees");

})


// To catch undefined route request
app.use(function (request, response) {
    response.status(404).sendFile(path.join(__dirname,"/views/404.html"));
  });


// initializing the data and starting server
dataService
  .initialize()
  .then(function () {
    app.listen(port, httpStart);
  })
  .catch(function (err) {
    console.log('Failed to start!' + err);
  });

