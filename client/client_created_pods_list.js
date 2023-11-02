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
    }
};

// var SucessResponse = {
//     "status": 200,
//     "data": ""
// };
// var ErrorResponse = {
//     "status": 400,
//     "data": ""
// };

exports.handler = async(event) => {
    
    const body      = JSON.parse(event.body);
    const client_id = body.clientID;
    console.log(body.clientID);
    
        // let client_id = 1547;
    try{
        var connection = mysql_connecton();
    }catch(err){
        console.log(err);
    }

    try{
        const get_pods_list = await client_pods(client_id,connection);
        console.log(get_pods_list);
            if(get_pods_list.length>0){
                let response_data = get_pods_list.map((itr)=>{
                   return {'id':itr.id,'techStack':itr.techStack,'skills':JSON.parse(itr.skills),'pod_timezone':itr.pod_timezone,'budget':itr.budget,'podName':itr.podName,'created_at':itr.created_at,'status':itr.status,'location':itr.location,'canID':itr.canID,'picture':itr.picture,'rating':itr.rating,'req':itr.req,'podtype':itr.podtype,'podsize':itr.podsize,'spot_left':itr.spot_left,'podDescription':itr.podDescription,'clientID':itr.clientID} 
                });
                // SucessResponse['data'] = get_pods_list;
                connection.end();
                return Response(200,{'status':200,'data':response_data});
            }else{
                // SucessResponse['data'] = [];
                return Response(200,{'status':200,'data':[]});
            }
        // return SucessResponse;
    }catch(err){
        console.log(err);
        // ErrorResponse['data'] = err;
        connection.end();
        return Response(400,{'status':400,'data':err});
    }
    
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

const client_pods = (client_id,connection)=>
    new Promise((resolve,reject)=>{
        let list_query = 'select * from pods where clientId='+client_id;
        connection.query(list_query,function(err,res){
            if(err){
                reject(err);
            }else{
                resolve(res);
            }
        });
    });