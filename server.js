/*************************************************************************
* BTI325– Assignment 6
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
No part of this assignment has been copied manually or electronically from any other source.
* (including 3rd party web sites) or distributed to other students.
*
* Name: _Ujjval Patel__ Student ID: __153763214__ Date: _November 26, 2022_
*
* Your app’s URL (from cyclic) that I can click to see your application:
* https://nutty-dress-seal.cyclic.app/
*
*************************************************************************/ 

const express = require("express"); //Inclusion of Express module
const path = require("path"); // Inclusion of Path Module for sending file with correct path.
const multer = require("multer"); // inclusion of multer module.
const fileSystem = require('fs'); // including for reading files
const dataService = require('./data-service.js'); // Inclusion of data-service module
const dataServiceAuth = require('./data-service-auth') // inclusion of data_service_auth_module
const clientSessions = require('client-sessions') // inclusion of Cliant_Sessions Module
const app = express(); // making app for server functioning
const exphbs = require("express-handlebars");// Including Express-Handlebars
const { response } = require("express");
const { request } = require("http");

let port = process.env.PORT || 8080; // Port defining 

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.engine('.hbs', exphbs.engine({ extname: '.hbs',
helpers: {
navLink: function(url, options){
  return '<li' +
  ((url == app.locals.activeRoute) ? ' class="active" ' : '') +
  '><a href=" ' + url + ' ">' + options.fn(this) + '</a></li>';
 },

 equal: function (lvalue, rvalue, options) {
  if (arguments.length < 3)
  throw new Error("Handlebars Helper equal needs 2 parameters");
  if (lvalue != rvalue) {
  return options.inverse(this);
  } else {
  return options.fn(this);
  }
 }
}

}));
app.set('view engine', '.hbs');

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

app.use(clientSessions({
  cookieName: "session", // this is the object name that will be added to 'req'
  secret: "Assignment_06_The_World_Is_Just_Awesome", // this should be a long un-guessable string.
  duration: 2 * 60 * 1000, // duration of the session in milliseconds (2 minutes)
  activeDuration: 1000 * 60 // the session will be extended by this many ms each request (1 minute)
}));

app.use((request, response, next)=>{
  response.locals.session = request.session;
  next();
});

let  ensureLogin = (request, response, next)=>{
  if (!request.session.user) {
    response.redirect("/login");
  } else {
    next();
  }
}


app.use(function(req,res,next){
  let route = req.baseUrl + req.path;
  app.locals.activeRoute = (route == "/") ? "/" : route.replace(/\/$/, "");
  next();
 });

 
// responding to default "/" home route
app.get("/",ensureLogin,(request,response)=>{
    response.render(path.join(__dirname,"/views/home.hbs"));
});

// responding to "/about" route
app.get("/about",ensureLogin,(request,response)=>{
    response.render(path.join(__dirname,"/views/about.hbs"));
});

// responding to "/departments" route
app.get("/departments",ensureLogin,(request,response)=>{
    dataService.getDepartments().then(function(data){
      if(data.length > 0)
        response.render("departments",{departments:data});
      else
      response.render("departments",{message:"No Results"});
    }).catch((error)=>{
      response.send(error);
    });
});

// responding to "/managers" route
// app.get("/managers",(request,response)=>{
//     dataService.getManagers().then(function(data){
//         response.json(data);
//     }).catch((error)=>{
//       response.send(error);
//     });
// });

// responding to "/employees" route with Queries
app.get("/employees",ensureLogin,(request,response)=>{

    if(request.query.status){
      dataService.getEmployeesByStatus(request.query.status).then((data)=>{
        if(data.length > 0)
        response.render("employees",{employees:data});
        else
        response.render("employees",{message:"No Results"});
      }).catch((error)=>{
        response.send(error);
      })
    }else if(request.query.department){
      dataService.getEmployeesByDepartment(request.query.department).then((data)=>{
        if(data.length > 0)
        response.render("employees",{employees:data});
        else
        response.render("employees",{message:"No Results"});
      }).catch((error)=>{
        response.send(error);
      })
    }else if(request.query.manager){
      dataService.getEmployeesByManager(request.query.manager).then((data)=>{
        if(data.length > 0)
        response.render("employees",{employees:data});
        else
        response.render("employees",{message:"No Results"});
      }).catch((error)=>{
        response.send(error);
      })
    }else{
    dataService.getAllEmployees().then((data) => {
        response.render("employees",{employees:data});
      }).catch((error)=>{
        response.render({message:"No Results"});
      });
    }

});


// responding to "/employees/add"" route
app.get("/employees/add",ensureLogin,(request,response)=>{
  dataService.getDepartments()
  .then((data)=>{
    response.render("addEmployee",{departments:data});
  })
  .catch(()=>{
    response.render("addEmployee",{departments:[]});
  })
});

// responding to "/images/add"" route
app.get("/images/add",ensureLogin,(request,response)=>{
  response.render("addImage.hbs");
});

// post route for redirecting and using middleware
app.post("/images/add",ensureLogin, upload.single("imageFile"), function(request, response){
  response.redirect("/images");
});

// to get the images in json object when responding to "/images" route.
app.get("/images",ensureLogin,(request,response)=>{

  fileSystem.readdir("./public/images/uploaded",(error,data)=>{
    if(error){
      console.log(error);
    }
    else{
      response.render("images",{imgArr:data});
    }

  });
});


app.post("/employees/add",ensureLogin,(request,response)=>{

  dataService.addEmployee(request.body).then(()=>{
    response.redirect("/employees");
  }).catch((err)=>{response.json("message:"+err)});
})

app.post("/employee/update",ensureLogin, (request, response) => {
  dataService.updateEmployee(request.body).then(()=>{
    //console.log(request.body);
    response.redirect("/employees");
  }).catch(()=>{
    response.send("Failed to Update!");
  })

});

app.get("/employee/:value",ensureLogin,(request,response)=>{

  // dataService.getEmployeeByNum(request.params).then((data)=>{
  //   response.render("employee",{employee:data[0]});
  //   //console.log({employee:data[0]}); for debuggig
  // }).catch((error)=>{
  //   response.send(error);
  // });
  let viewData = {};
  dataService.getEmployeeByNum(request.params.value)
  .then((data) => {
    //console.log(data);
    if (data) {
      viewData.employee = data; //store employee data in the "viewData" object as "employee"
    } else {
      viewData.employee = null; // set employee to null if none were returned
    }
  })
  .catch(() => {
    viewData.employee = null; // set employee to null if there was an error
  })
  .then(dataService.getDepartments)
  .then((data) => {
    viewData.departments = data; // store department data in the "viewData" object as "departments"
                                  // loop through viewData.departments and once we have found the departmentId that matches
                                  // the employee's "department" value, add a "selected" property to the matching
                                  // viewData.departments object
     for (let i = 0; i < viewData.departments.length; i++) {
      //console.log(viewData.employee.department);
          if (viewData.departments[i].departmentId == viewData.employee.department) {
                viewData.departments[i].selected = true;
          }
      }
  })
  .catch(() => {
    viewData.departments = []; // set departments to empty if there was an error
  })
  .then(() => {
      if (viewData.employee == null) { // if no employee - return an error
          response.status(404).send("Employee Not Found");
       } else {
          response.render("employee", { viewData: viewData }); // render the "employee" view
      }
  });

});

//Routes for Assignment 5

app.get('/departments/add',ensureLogin,(request,response)=>{
  response.render("addDepartment.hbs");
})

app.post('/departments/add',ensureLogin,(request,response)=>{
  dataService.addDepartment(request.body).then(()=>{
  response.redirect("/departments");
  }).catch((err)=>{response.send(err)});
});

app.post('/department/update',ensureLogin,(request,response)=>{
  dataService.updateDepartment(request.body)
  .then(()=>{
    response.redirect("/departments");
  })
  .catch((err)=>{
    response.send(err);
  });
})

app.get('/department/:departmentId',ensureLogin,(request,response)=>{
  dataService.getDepartmentById(request.params).then((data)=>{
    if(data.length <= 0){
      //console.log(data);
      response.status(404).send("Department Not Found");
    }
    else{
      console.log(data);
      response.render("department",{department:data[0]});
    }
  }).catch((err)=>{
    console.log(err);
    response.status(404).send("Department Not Found");})
})

app.get("/employees/delete/:value",ensureLogin,(request,response)=>{
  dataService.deleteEmployeeByNum(request.params.value)
  .then(()=>{
    response.redirect("/employees");
  })
  .catch(()=>{
    response.status(500).send(`Unable to Remove Employee with EmpNum: ${request.params.value}`);
  })
})

//---Adding New Routes for Assignment 6---//

app.get("/login",(request,response)=>{
  response.render("login")
});

app.post("/login",(request,response)=>{
  //response.render("login")
  request.body.userAgent = request.get('User-Agent');
  dataServiceAuth.checkUser(request.body)
  .then((user)=>{
    request.session.user = {
      userName:user.userName,
      email:user.email,
      loginHistory:user.loginHistory
    }
    response.redirect("/employees");
  })
  .catch((error)=>response.render("login",{errorMessage: error, userName: request.body.userName}))

});

app.get("/register",(request,response)=>{
  response.render("register")
});

app.post("/register",(request,response)=>{
  dataServiceAuth.registerUser(request.body)
  .then(()=>response.render("register",{successMessage: "User created"}))
  .catch((error)=>response.render("register",{errorMessage: error, userName: request.body.userName}))
});

app.get("/logout",(request,response)=>{
  request.session.reset();
  response.redirect("/");
})

app.get("/userHistory",ensureLogin,(request,response)=>{
  response.render("userHistory");
})

// To catch undefined route request
app.use(function (request, response) {
    response.status(404).render(path.join(__dirname,"/views/404.hbs"));
  });


// initializing the data and starting server
dataService
  .initialize()
  .then(dataServiceAuth.initialize)
  .then(function () {
    app.listen(port, httpStart);
  })
  .catch(function (err) {
    console.log('Failed to start!' + err);
  });

