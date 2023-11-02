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
        const get_req_list = await getpod_requirements(client_id,connection);
        console.log(get_req_list);
            if(get_req_list.length>0){
                output['pod_requirements'] = get_req_list;
                // let response_data = get_req_list.map((itr)=>{
                //    return {'id':itr.id,'techStack':itr.techStack,'skills':JSON.parse(itr.skills),'pod_timezone':itr.pod_timezone,'budget':itr.budget,'podName':itr.podName,'created_at':itr.created_at,'status':itr.status,'location':itr.location,'canID':itr.canID,'picture':itr.picture,'rating':itr.rating,'req':itr.req,'podtype':itr.podtype,'podsize':itr.podsize,'spot_left':itr.spot_left,'podDescription':itr.podDescription,'clientID':itr.clientID} 
                // });
                // connection.end();
                // return Response(200,{'status':200,'data':get_req_list});
            }
            // }else{
            //     return Response(200,{'status':200,'data':[]});
            // }
    }catch(err){
        console.log(err);
        connection.end();
        return Response(400,{'status':400,'data':err});
        // return Response(400,{'status':400,'data':err});
    }
    
    try{
        const get_ind_req = await get_individual_requirements(client_id,connection);
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

const getpod_requirements = (client_id,connection)=>
    new Promise((resolve,reject)=>{
        // let list_query = 'SELECT pod.*,ind.* from project_pod as pod INNER JOIN project as ind where pod.client_ID and ind.client_ID ='+client_id;
        let list_query = 'SELECT * from project_pod where client_ID = '+client_id;
        connection.query(list_query,function(err,res){
            if(err){
                reject(err);
            }else{
                resolve(res);
            }
        });
    });
    
const get_individual_requirements = (client_id,connection)=>
    new Promise((resolve,reject)=>{
        let list_query = 'SELECT * from  project where client_ID = '+client_id;
        connection.query(list_query,function(err,res){
            if(err){
                reject(err);
            }else{
                resolve(res);
            } 
        });
    });
    
    
    