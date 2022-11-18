// const fileSystem = require('fs'); // including for reading files
// const { resolve } = require('path');
// let employees = []; // to hold the employees in the array
// let departments = []; // to hold departments in array 
// let employee = [] // to hold results temporarily

module.exports.initialize = function () {
  return new Promise((resolve, reject) => {
   reject();
  });
};


module.exports.getAllEmployees = function () {
  return new Promise((resolve, reject) => {
    reject();
  });
};
  

module.exports.getManagers = function () {
  return new Promise((resolve, reject) => {
    reject();
  });
};
  
  
module.exports.getDepartments = function () {
  return new Promise((resolve, reject) => {
    reject();
  });
};


module.exports.addEmployee = (employeeData)=>{
  return new Promise((resolve,reject)=>{
    reject();
  });
};

module.exports.updateEmployee = (employeeData)=>{
  return new Promise((resolve,reject)=>{
    reject();
  })
}

module.exports.getEmployeesByStatus = (status)=>{
  return new Promise((resolve,reject)=>{
    reject();
  });
};


module.exports.getEmployeesByDepartment = (department)=>{
  return new Promise((resolve,reject)=>{
    reject();
  });
};


module.exports.getEmployeesByManager = (manager)=>{
  return new Promise((resolve,reject)=>{
    reject();
  });
};

module.exports.getEmployeeByNum = (num)=>{
  return new Promise((resolve,reject)=>{
    reject();
  });
};