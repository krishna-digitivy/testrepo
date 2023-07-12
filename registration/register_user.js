var uuid            = require('uuid').v4();
var connection      = require('../database/database.js');
var SucessResponse  = {
    "status": 200,
    "data": ""
};
var ErrorResponse   = {
    "status": 400,
    "data": ""
};
exports.handler = async(event, context, callback) => {
    
    console.log(event);
    let email = event.email;
    let usertype = event.usertype == 1 ? 'candidate' : event.usertype == 2 ? 'podprovider' : 'employer';
    // let calendlyurl = event.calendlyurl;
    // let talent_code = event.talent_code;
    console.log('------------------------');
    console.log(usertype);
    console.log('------------------------');
    var query1 = (usertype === 'podprovider') ? `insert into ${usertype}(email,partner_code) values('${email}','PARTNER#${uuid}')`: 
       (usertype === 'employer') ? `insert into ${usertype}(email,client_code) values('${email}','CLIENT#${uuid}')` : 
       `insert into ${usertype}(email,talent_type) values('${email}','CLIENT')`;
    console.log(query1);
    let env = event.env;
    // (async () => {  
    
            try {
                var candidateupdate = await addCandidate(query1);
                // connection.end();
                if (candidateupdate) {
                    // connection.end();
                    SucessResponse["data"] = "Candidate Registred!";
                }
                return SucessResponse;
            } catch (err) {
                // connection.end();
                ErrorResponse["data"] = err;
                return ErrorResponse;
            }
    // })();
    // function addCandidate(query1) {
    //     // const data = {
    //     //     email : email,
    //     // }
    //     return new Promise((resolve, reject) => {
    //         // var query1 = "INSERT INTO " + usertype + " SET ?";
    //         connection.query(query1, function (err1, res) {
    //             return err1 ? reject(err1) : resolve(res);
    //         });
    //     });
    // }
 
};
const addCandidate = (query1)=>
    new Promise((resolve,reject)=>{
       connection.query(query1,(err,res)=>{
          if(err){
              reject(err);
          }else{
              resolve(res);
          } 
       }); 
    });
