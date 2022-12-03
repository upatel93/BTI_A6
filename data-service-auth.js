const mongoose = require('mongoose'); // including moongoose
let Schema = mongoose.Schema;
let userSchema = new Schema({
    "userName": {
        "type":String,
        "unique":true
    },
    "password": String,
    "email": String,
    "loginHistory":[{
        "dateTime": Date,
        "userAgent": String
    }]
});
let pwd = "VkBU1ZayKCGMGF9R";
let url = `mongodb+srv://upatel69:${pwd}@senecaweb.uclzryc.mongodb.net/?retryWrites=true&w=majority`
let User; // to be defined on new connection

//let db = mongoose.createConnection(url, {useNewUrlParser: true, useUnifiedTopology: true})

module.exports.initialize = () =>{
    return new Promise((resolve,reject)=>{
        let db = mongoose.createConnection(url, {useNewUrlParser: true, useUnifiedTopology: true});

        //Checking if the connection is established
        db.on('error',(error)=>{ 
            console.log(`Error..!! - ${error}`);
            reject();
        });

        //If connection is established
        db.once('open',()=>{
            User = db.model("users",userSchema); // Registering userSchema to users
            resolve();
        });

    });
};

module.exports.registerUser = (userData)=>{
    return new Promise((resolve,reject)=>{
        if(trim(userData.password).length == 0 || trim(userData.password2).length == 0){
            reject("Error: user name cannot be empty or only white spaces! ");
        }

        if(userData.password != userData.password2){
            reject("Error: Passwords do not match");
        }

        let newUser = User(userData);

        newUser.save()
        .then(()=>resolve())
        .catch((error)=>{
            if(error.code == 11000){
                reject("User Name already taken");
            }else{
                reject(`There was an error while creating user : ${error}`);
            }
        })

    });
};
// need to work on this..
module.exports.checkUser = (userData) => {
    return new Promise((resolve,reject)=>{
        User.findOne({ userName : userData.userName }).exec()
        .then((user)=>{
            if(user){

            }
        })
        .catch()
    });
};