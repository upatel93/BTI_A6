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
        if(isValid(userData.userName)){
            reject("Error: User name cannot be empty or only white spaces! ");
        }

        if(isValid(userData.password)){
            reject("Error: Password cannot be empty or only white spaces! ");
        }

        userData.userName = userData.userName.trim();

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
                console.log(user);
                if(user.password != userData.password){
                    reject(`Incorrect password for user: ${userData.userName}`)
                }else{
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
                }

            }else{
                reject(`Unable to find user: ${userData.userName}`)
            }
        })
        .catch((error)=>{
            reject(`There was error in finding user: ${error}`)
        })
    });
};