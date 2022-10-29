const fileSystem = require('fs'); // including for reading files
let employees = []; // to hold the employees in the array
let departments = []; // to hold departments in array 
let employee = [] // to hold results temporarily

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
      fileSystem.readFile('./data/employees.json', (err, data) => { // reading file
        if (err) {  // if file isnt found or any issue with file
          reject("Failure to read file employees.json");
        }
        else{ // if successfull
        employees = JSON.parse(data);
        resolve();
        }
      });
      fileSystem.readFile('./data/departments.json', (err, data) => {
        if (err) {
          reject("Failure to read file departments.json");
        }
        else{
        departments = JSON.parse(data);
        resolve();
        }
      });
    });
  };

  module.exports.getAllEmployees = function () {
    return new Promise((resolve, reject) => {
      if (employees.length == 0) { // to check the array of employees has some data
        reject('No data available on employees!');
      }
      resolve(employees);
    });
  };
  
  module.exports.getManagers = function () {
    return new Promise((resolve, reject) => {
      var managers = [];
      for (let i = 0; i < employees.length; i++) {
        if (employees[i].isManager == true) { // to check employee is a manager or not 
          managers.push(employees[i]); // if employee is manager it is stored in managers array with push method of array objects
        }
      }
      if (managers.length == 0) { // to check the array of managers has some data
        reject('No data available on managers!');
      }
      else{
      resolve(managers); // if manager has some data than reslove method will forward that managers object(array)
      }
    });
  };
  
  
  module.exports.getDepartments = function () {
    return new Promise((resolve, reject) => {
      if (departments.length == 0) {
        reject('No data available on departments!');
      }
      resolve(departments);
    });
  };

  module.exports.addEmployee = (employeeData)=>{
    return new Promise((resolve,reject)=>{

      let newEmp = {
        employeeNum:employees.length+1,
        firstName:employeeData.firstName,
        lastName:employeeData.lastName,
        email:employeeData.email,
        SSN:employeeData.SSN,
        addressStreet:employeeData.addressStreet,
        addressCity:employeeData.addressCity,
        addressState:employeeData.addressState,
        addressPostal:employeeData.addressPostal,
        maritalStatus:employeeData.maritalStatus,
        isManager: employeeData.isManager == undefined ? false:employeeData.isManager,
        employeeManagerNum:employeeData.employeeManagerNum,
        status:employeeData.status,
        department:employeeData.department,
        hireDate:employeeData.hireDate
      };

      employees.push(newEmp);
      resolve();
    });
  };

  module.exports.getEmployeesByStatus = (status)=>{
    return new Promise((resolve,reject)=>{
      employee = []; // to clear employee
      for (var i of employees){
        if(i.status == status){
          employee.push(i);
        }
      }

      if(employee.length == 0){
        reject("There are no Employees with " + status + " status");
      }

      resolve(employee);

    });
  };


  module.exports.getEmployeesByDepartment = (department)=>{
    return new Promise((resolve,reject)=>{
      employee = []; // to clear employee
      for (var i of employees){
        if(i.department == department){
          employee.push(i);
        }
      }

      if(employee.length == 0){
        reject("There are no Employees having " + department + " as their department");
      }

      resolve(employee);

    });
  };

  module.exports.getEmployeesByManager = (manager)=>{
    return new Promise((resolve,reject)=>{
      employee = []; // to clear employee
      for (var i of employees){
        if(i.employeeManagerNum == manager){
          employee.push(i);
        }
      }

      if(employee.length == 0){
        reject("There are no Employees having manager#" + manager + " as their manager");
      }

      resolve(employee);

    });
  };

  module.exports.getEmployeeByNum = (num)=>{
    return new Promise((resolve,reject)=>{
      employee = []; // to clear employee
      for (var i of employees){
        if(i.employeeNum == num.value){
          employee.push(i);
        }
      }

      if(employee.length == 0){
        reject("There is no Employee having " + num.value + " as their employee#.");
      }

      resolve(employee);

    });
  };