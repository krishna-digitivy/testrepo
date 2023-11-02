var mysql = require('mysql');
var config = require('./config.json');

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
    // const body          = JSON.parse(event.body);
    const client_id     = event.clientID;
    const pod_id        = event.podID;

    var subscriptions = false;

    try{
        var connection = mysql_connecton();
    }catch(err){
        console.log(err);
    }

    try{
        const get_subscription_dtls = await check_subsription(client_id,connection);
        console.log(get_subscription_dtls);
            if(get_subscription_dtls.length>0){
                subscriptions = true;
            }else{
                return Response(200,{'status':200,'data':[]});
            }
    }catch(err){
        console.log(err);
        connection.end();
        return Response(400,{'status':400,'data':err});
    }

    try{
        const update_pod_info = await client_update_pods(client_id,pod_id,connection);
        console.log(update_pod_info);
        connection.end();
        return Response(200,{'status':200,'data':'Congrats, You Hired This Pod!'}); 
    }catch(err){
        console.log(err);
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

const client_update_pods = (client_id,pod_id,connection)=>
    new Promise((resolve,reject)=>{
        let query1 = "UPDATE pods SET status = 'Hired', clientID = '" + client_id +  "' WHERE `id` = '" + pod_id + "'";
        connection.query(query1,function(err,res){
            if(err){
                reject(err);
            }else{
                resolve(res);
            }
        });
    });

const check_subsription = (client_id,connection)=>
    new Promise((resolve,reject)=>{
        let query1 = 'select * from `client-subscriptions` where client_ID ='+client_id;
        connection.query(query1,function(err,res){
            if(err){
                reject(err);
            }else{
                resolve(res);
            }
        });
    });