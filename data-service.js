const Sequelize = require('sequelize');
let sequelize = new Sequelize('wlpgyefj', 'wlpgyefj', 'mtVk-HK7nhXwcAiPwf_nYNhr09vsHqyH', {
  host: 'peanut.db.elephantsql.com',
  dialect: 'postgres',
  port: 5432,
  dialectOptions: {
  ssl: true
  },
  query:{raw: true}
});

sequelize
.authenticate()
.then(()=> console.log('Connection success.'))
.catch((err)=>console.log("Unable to connect to DB.", err));

let Employee = sequelize.define('Employee', {
  employeeNum:{
    type:Sequelize.INTEGER,
    primaryKey: true, 
    autoIncrement: true
  },
  firstName:Sequelize.STRING,
  lastName:Sequelize.STRING,
  email:Sequelize.STRING,
  SSN:Sequelize.STRING,
  addressStreet:Sequelize.STRING,
  addressCity:Sequelize.STRING,
  addressState:Sequelize.STRING,
  addressPostal:Sequelize.STRING,
  maritalStatus:Sequelize.STRING,
  isManager:Sequelize.BOOLEAN,
  employeeManagerNum:Sequelize.INTEGER,
  status:Sequelize.STRING,
  department:Sequelize.INTEGER,
  hireDate:Sequelize.STRING
});

let Department = sequelize.define('Department',{
  departmentId:{
    type:Sequelize.INTEGER,
    primaryKey: true, 
    autoIncrement: true
  },
  departmentName:Sequelize.STRING
});


module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
    sequelize.sync()
    .then(()=>resolve())
    .catch(()=>reject("Unable to synchronize the database"));
  });
};


module.exports.getAllEmployees = function () {
  return new Promise((resolve, reject) => {
    Employee.findAll()
    .then((data)=>resolve(data))
    .catch(()=> reject("Error! No Employees returned..!!"));
  });
};
  

// module.exports.getManagers = function () {
//   return new Promise((resolve, reject) => {
//     reject();
//   });
// };
  
  
module.exports.getDepartments = function () {
  return new Promise((resolve, reject) => {
    Department.findAll()
    .then((data)=>resolve(data))
    .catch(()=>reject("Error! No Results for Departments"));
  });
};


module.exports.addEmployee = (employeeData)=>{
  return new Promise((resolve,reject)=>{
    
    //1. correcting isManager
    employeeData.isManager = employeeData.isManager == undefined ? false:employeeData.isManager

    //2. correcting key:"" to key:null
    for(let i in employeeData){
      if(i === ""){
        i = null;
      }
    }
    Employee.create(employeeData)
    .then(()=>resolve())
    .catch(()=>reject("Error! Unable to create Employee..!!"));

  });
};

module.exports.updateEmployee = (employeeData)=>{
  return new Promise((resolve,reject)=>{
    //1. correcting isManager
    employeeData.isManager = employeeData.isManager == undefined ? false:employeeData.isManager

    //2. correcting key:"" to key:null
    for(let i in employeeData){
      if(i === ""){
        i = null;
      }
    }

    Employee.update(employeeData,{where:{SSN:employeeData.SSN}})
    .then(()=>resolve())
    .catch(()=>reject("Error! Unable to update employee..!!"));
  })
}

module.exports.getEmployeesByStatus = (Status)=>{
  return new Promise((resolve,reject)=>{
    Employee.findAll({where:{status:Status}})
    .then((data)=>resolve(data))
    .catch(()=>reject("No Result returned for Employee's status"));    
  });
};


module.exports.getEmployeesByDepartment = (Department)=>{
  return new Promise((resolve,reject)=>{
      Employee.findAll({where:{department:Department}})
      .then((data)=>resolve(data))
      .catch(()=>reject("No Result returned for Department"));
  });
};


module.exports.getEmployeesByManager = (Manager)=>{
  return new Promise((resolve,reject)=>{
    Employee.findAll({
      where:{employeeManagerNum:Manager}
    })
      .then((data)=>resolve(data))
      .catch(()=>reject("No Result returned for Manager"));
  });
};

module.exports.getEmployeeByNum = (num)=>{
  return new Promise((resolve,reject)=>{
    Employee.findAll({
    where: {
      employeeNum:num
    }})
      .then((data)=>{resolve(data[0])})
      .catch(()=>reject("No Result returned for Employee_Num"));
  });
};

//New Routes for Assignment 05

module.exports.addDepartment = (departmentData)=>{
  return new Promise((resolve,reject)=>{
    for(let i in departmentData){
      if(i === ""){
        i = null;
      }

      Department.create(departmentData)
      .then(()=>resolve())
      .catch(()=>reject("Error! Unable to create department..!!"));
    }
  });
};

module.exports.updateDepartment = (departmentData)=>{
  return new Promise((resolve,reject)=>{
    for(let i in departmentData){
      if(i === ""){
        i = null;
      }

      Department.update(departmentData,{where:{departmentId:departmentData.departmentId}})
      .then(()=>resolve())
      .catch(()=>reject("Error! Unable to update department..!!"));
    }
  });
};

module.exports.getDepartmentById = (id)=>{
  return new Promise((resolve,reject)=>{
    Department.findAll({
      where: {
        departmentId:id.departmentId
      }})
      .then((data)=> resolve(data))
      .catch(()=>reject(`Error! No Result Returned for Department + ${id.value}`));
  })
}


module.exports.deleteEmployeeByNum = (num)=>{
  return new Promise((resolve,reject)=>{
    Employee.destroy({
      where: {
        employeeNum:num
      },force:true})
      .then((data)=>{
        if(data > 0){ // Since destroy function returns number of rows it deleted. thus
                    //it need to be menually rejected.
        resolve("Destroyed..!")
        }
        else{
        reject("Rejected..!!")
        }
      })
      .catch(()=>{
        reject("Rejected..!!")})
  })
}