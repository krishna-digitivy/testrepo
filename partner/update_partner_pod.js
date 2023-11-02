var connection    = require('../database/database');
var SucessResponse = {
    "status": 200,
    "data": ""
};
var ErrorResponse = {
    "status": 400,
    "data": ""
};
exports.handler = async(event) => {
    let {id, podName, skills, budget, techStack, candidatesid,location, podDescription, podsize, timezone, picture,podtype} = event;

    try {
        var updatepod = await project_into_database(id, podName, skills, budget, techStack, location, timezone, candidatesid, podsize, podDescription,picture,podtype);
        console.log(updatepod);
        connection.end();
        SucessResponse["data"] = "Pod Details Updated Successfully";
        
        return SucessResponse;
    } catch (err1) {
        connection.end();
        ErrorResponse["data"] = err1;
        return ErrorResponse;
    }  
    
};

const project_into_database = (id, podName, skills, budget, techStack, location, timezone, candidatesid, podsize, podDescription,picture,podtype) =>{
        return new Promise((resolve, reject) => {
            var query101 = "SELECT * from pods WHERE id = '" + id + "'";
            connection.query(query101, function (err1, poddata) {
                if(err1){
                    return err1;
                }else{
                    if(candidatesid.length > 0) {   
                            var query1 = "UPDATE pods SET podName = ?, skills = ?, budget = ?, techStack = ?, location = ?, pod_timezone = ?, podDescription = ?, picture=?, podsize = ?, podtype = ?  WHERE id = '" + id + "'";
                            connection.query(query1, [podName, JSON.stringify(skills), budget, techStack, location, timezone, podDescription, picture, podsize, podtype],function (err11, result) { 
                                if(err1){
                                    ErrorResponse["data"] = err1;
                                    reject(ErrorResponse)
                                }else{
                                    if(result.affectedRows == 1) {        
                                        connection.query('INSERT INTO PodCandidates (podID, candidateID) VALUES ?', [candidatesid.map(item => [id, item.id ])], (error, results) => {
                                            return err1 ? reject(err1) : resolve(results);})                 
                                    }else{
                                        resolve(result)
                                    }   
                                }
                        });         
                    }else{
                        var query1 = "UPDATE pods SET podName = ?, skills = ?, budget = ?, techStack = ?, location = ?, pod_timezone = ?, picture = ?, podsize = ?, podtype = ?, podDescription = ?  WHERE id = '" + id + "'";
                        connection.query(query1, [podName, JSON.stringify(skills), budget, techStack, location, timezone, picture, podsize, podtype, podDescription],function (err1, result) {
                            if(err1){
                                ErrorResponse["data"] = err1;
                                reject(ErrorResponse)
                            }else{
                                resolve(result)
                            }
                        });
                    };
                }
            });       
        });
    }