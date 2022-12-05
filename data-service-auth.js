const mongoose = require('mongoose'); // including moongoose
const bcrypt = require('bcryptjs'); // Inclusion of bscrypter as per instruction
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
let url = `mongodb+srv://upatel69:${pwd}@senecaweb.uclzryc.mongodb.net/assignment?retryWrites=true&w=majority`
let User; // to be defined on new connection

//let db = mongoose.createConnection(url, {useNewUrlParser: true, useUnifiedTopology: true})

//String Validator
let isValid = (string)=>{
    let valid = true;
    if(string){
       if(string.trim().length !== 0)
       return valid;
    }
    return !valid;
}

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
            console.log(`Success MongoDB connected`);
            resolve();
        });

    });
};

module.exports.registerUser = (userData)=>{
    return new Promise((resolve,reject)=>{
        //console.log(userData);
        //console.log(userData.userName);
        //let hashed = false;
        if(!isValid(userData.userName)){
            reject("User name cannot be empty or only white spaces! ");
            return;
        }

        if(!isValid(userData.password)){
            reject("Password cannot be empty or only white spaces! ");
            return;
        }

        userData.userName = userData.userName.trim();

        if(userData.password != userData.password2){
            reject("Passwords do not match");
            return;
        }

        bcrypt.hash(userData.password, 10).then(hash=>{ 
            userData.password = hash;
            let newUser = User(userData);
            console.log(newUser);
            resolve();
            newUser.save()
            .then(()=>resolve())
            .catch((error)=>{
                if(error.code == 11000){
                    reject("User Name already taken");
                    return;
                }else{
                    reject(`There was an error while creating user : ${error}`);
                    return;
                }
            })
        })
        .catch(error=>{
            console.log(error); // Show any errors that occurred during the process
            reject("There was an error encrypting the password");
        });
    });
};


module.exports.checkUser = (userData) => {
    return new Promise((resolve,reject)=>{
        User.findOne({ userName : userData.userName }).exec()
        .then((user)=>{
            if(user){
                //console.log(user);
                bcrypt.compare(userData.password, user.password).then((result) => {
                    if(result){
                        user.loginHistory.push({dateTime: (new Date()).toString(), userAgent: userData.userAgent})
    
                        User.update({
                            userName : user.userName
                        },{
                             $set: {loginHistory: user.loginHistory}
                        },{
                            multi: false
                        })
                        .exec()
                        .then(()=>resolve(user))
                        .catch((error)=> reject(`There was an error verifying the user : ${error}`))
                    }else{
                        reject(`Incorrect password for user: ${userData.userName}`)
                        return;
                    }
                });

            }else{
                reject(`Unable to find user: ${userData.userName}`)
                return;
            }
        })
        .catch((error)=>{
            reject(`There was error in finding user: ${error}`)
            return;
        })
    });
};