const express = require("express"); //Inclusion of Express module
const path = require("path"); // Inclusio of Path Module for sending file with correct path.
const dataService = require('./data-service.js'); // Inclusion of data-service module
const app = express(); // making app for server functioning

let port = process.env.PORT || 8080; // Port defining 

function httpStart(){  // logging Port on console for debugging purpose.
console.log(`Express http server listening on port: ${port}`);
};

// Professor will discuss in class
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

