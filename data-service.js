const fileSystem = require('fs'); // including for reading files
let employees = []; // to hold the employees in the array
let departments = []; // to hold departments in array 

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
