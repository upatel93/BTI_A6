const fileSystem = require('fs');
let employees = [];
let departments = [];

module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
      fileSystem.readFile('./data/employees.json', (err, data) => {
        if (err) {
          reject("Failure to read file employees.json");
        }
        else{
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
      if (employees.length == 0) {
        reject('No data available on employees!');
      }
      resolve(employees);
    });
  };
  
  module.exports.getManagers = function () {
    return new Promise((resolve, reject) => {
      var managers = [];
      for (let i = 0; i < employees.length; i++) {
        if (employees[i].isManager == true) {
          managers.push(employees[i]);
        }
      }
      if (managers.length == 0) {
        reject('No data available on managers!');
      }
      resolve(employees);
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


