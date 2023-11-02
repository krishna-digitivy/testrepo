var mysql = require('mysql');
var config = require('../config.json');

const Response = (statusCode,body)=>{
    return {
        'statusCode' : statusCode,
        'body'       : JSON.stringify(body),
        headers    : {
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin':'*'
        }   
    };
};

exports.handler = async(event) => {
    console.log(event);
    // const body          = JSON.parse(event.body);
    const client_id     = event.clientID;

    try{
        var connection = mysql_connecton();
    }catch(err){
        console.log(err);
    }

    var pod_info        = null;
    var pod_candidates  = null;
    var pod_activities  = null;
    

    try{
        const get_pod_info = await client_get_private_pods(client_id,connection);
        console.log(get_pod_info);
        pod_info = get_pod_info;
    }catch(err){
        console.log(err);
        return Response(400,{'status':400,'body':err});
    }
    
    if(pod_info){
        try{
            const get_candidates = await client_privte_pod_candidates(pod_info[0].id,connection);
            console.log(get_candidates);
            pod_candidates = get_candidates;
        }catch(err){
            console.log(err);
            return Response(400,{'status':400,'body':err});
        }
    }
    
    if(pod_info){
        try{
            const get_pod_activitiesdata = await get_pod_activities(pod_info[0].id,connection);
            console.log(get_pod_activitiesdata);
            pod_activities = get_pod_activitiesdata;
        }catch(err){
            console.log(err);
            return Response(400,{'status':400,'body':err});
        }
    }
    
    let output = {podDetails : pod_info,candidates:pod_candidates,activities:pod_activities};
    
    return Response(200,{'status':200,'body':output});
    
};

function mysql_connecton() {
    var params = {
        host: config.host,
        user: config.user,
        password: config.password,
        database: config.database,
        port: config.port
    };
    return mysql.createConnection(params);
}

const client_get_private_pods = (client_id,connection)=>
    new Promise((resolve,reject)=>{
        let query1 = "SELECT * from pods WHERE clientID = '" + client_id + "' AND status = 'Private'";
        connection.query(query1,function(err,res){
            if(err){
                reject(err);
            }else{
                resolve(res);
            }
        });
    });

const client_privte_pod_candidates = (pod_id,connection)=>
    new Promise((resolve,reject)=>{
        let query1 = 'select c.* from candidate c inner join PodCandidates p on c.c_id = p.candidateID where p.podID ='+pod_id;
        connection.query(query1,function(err,res){
            if(err){
                reject(err);
            }else{
                resolve(res);
            }
        });
    });

const get_pod_activities = (pod_id,connection)=>
    new Promise((resolve,reject)=>{
        let query1 = 'select p.*,c.firstName,c.lastName from pod_activity p inner join candidate c on p.created_by = c.c_id where p.pod_id ='+pod_id;
        connection.query(query1,function(err,res){
            if(err){
                reject(err);
            }else{
                resolve(res);
            }
        });
    });