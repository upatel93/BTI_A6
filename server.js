let express = require("express"); //Inclusion of Express module
const { dirname } = require("path");
let path = require("path");
let app = express(); // making app for server functioning

let port = process.env.PORT || 8080; // Port definining 

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

app.listen(port,httpStart);