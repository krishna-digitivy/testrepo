var connection    = require('../database/database');
const uuid        = require('uuid').v4();
var SucessResponse = {
    "status": 200,
    "data": ""
};
var ErrorResponse = {
    "status": 400,
    "data": ""
};

exports.handler = async(event) => {

    let id = Math.round(1302 * Math.random());
    let { podName, skills, budget, techStack, candidatesid, location, timezone, podsize, podtype, picture, podDescription,created_by } = event;
    const created_type = 'PARTNER';
    const partner_id = 'PARTNER#'+uuid; 
    
    console.log(event);    

    try {
        var create_partner_pods = await create_partner_pod(id, podName, skills, budget, timezone, podsize, podtype, podDescription,created_by,created_type,partner_id);
        console.log(create_partner_pods);
        SucessResponse["data"] = "New Pod Details Added Successfully";
        return SucessResponse;
    } catch (err1) {
        connection.end();
        ErrorResponse["data"] = err1;
        return ErrorResponse;
    }
      
};    

const  create_partner_pod = (id, podName, skills, budget, timezone, podsize, podtype, podDescription, created_by,created_type,partner_id) =>{
        return new Promise((resolve, reject) => {
            console.log('entering.........')
            let spotleft = podsize; 
            let skills_string = JSON.stringify(skills);
            var query1 = "insert into pods (id, podName, skills, budget, pod_timezone, podsize, podtype, spot_left, podDescription, created_by, created_type, provider_account) values(?,?,?,?,?,?,?,?,?,?,?,?)";

            connection.query(query1,[id,podName,skills_string,budget,timezone,podsize,podtype,spotleft,podDescription,created_by,created_type,partner_id], function (err1, result) {                
                console.log(query1);
                if(err1){
                    ErrorResponse["data"] = err1;
                    console.log("error", err1);
                    reject(ErrorResponse);
                }else{
                    if (result.affectedRows === 1) {
                        resolve(result);
                        // connection.query("SELECT * from pods WHERE id = '" + id + "'", (err, Poddata) => {
                        //     if(err){
                        //         console.log(err);
                        //         return err;
                        //     }else{
                        //         connection.query('INSERT INTO PodCandidates (podID, candidateID) VALUES ?', [candidatesid.map(item => [id, item.id ])], (error, results) => {
                        //             console.log(error, results);
                        //             return error ? reject(error) : resolve(result);
                        //         });
                        //     }
                        // });
                    }
                }
            });   
        });
    };