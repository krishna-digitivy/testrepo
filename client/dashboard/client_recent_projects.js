var mysql = require('mysql');
var config = require('../../config.json');

const Response = (statusCode,body)=>{
    return {
        'statusCode' : statusCode,
        'body'       : JSON.stringify(body),
        headers    : {
            'Content-Type':'application/json',
            'Access-Control-Allow-Origin':'*'
        }
    }
};

exports.handler = async(event) => {
    console.log(event);
    // const body      = JSON.parse(event.body);
    const client_id = event.queryStringParameters.client_id;
    console.log(client_id);

    try{
        var connection = mysql_connecton();
    }catch(err){
        console.log(err);
    }
    
    let output = {"individual_requirements":[],"pod_requirements":[]};

    try{
        const get_req_list = await getpod_recent_requirements(client_id,connection);
        console.log(get_req_list);
            if(get_req_list.length>0){
                output['pod_requirements'] = get_req_list;
            }
    }catch(err){
        console.log(err);
        connection.end();
        return Response(400,{'status':400,'data':err});
    }
    
    try{
        const get_ind_req = await get_individual_recent_requirements(client_id,connection);
        console.log(get_ind_req);
        if(get_ind_req.length>0){
            output['individual_requirements'] = get_ind_req;
        }
    }catch(err){
        console.log(err);
        connection.end();
        return Response(400,{'status':400,'data':err});
    }
    
    connection.end();
    return Response(200,{'status':200,'data':output});
    
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

const getpod_recent_requirements = (client_id,connection)=>
    new Promise((resolve,reject)=>{
        let list_query = 'SELECT * from project_pod where where created_at >= DATE(NOW()) - INTERVAL 5 DAY  and client_ID = '+client_id+' and limit 5';
        connection.query(list_query,function(err,res){
            if(err){
                reject(err);
            }else{
                resolve(res);
            }
        });
    });
    
const get_individual_recent_requirements = (client_id,connection)=>
    new Promise((resolve,reject)=>{
        let list_query = 'SELECT * from  project where created_at >= DATE(NOW()) - INTERVAL 5 DAY  and client_ID = '+client_id+' and limit 5';
        connection.query(list_query,function(err,res){
            if(err){
                reject(err);
            }else{
                resolve(res);
            } 
        });
    });
    
    
    