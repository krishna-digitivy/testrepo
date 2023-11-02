const mysql     = require('mysql');
const config    = require('../../config.json');
const stripe    = require('stripe')('sk_test_51MlkA3CrTnlS95H4iPqibbGbkuWpkefYEtP4RzOI3zCrTbDsOxpxKaUyQncFy6KJoswUB32CD185KNLOMTJCdwpW00kOn9TUQV');

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
    const client_id = event.queryStringParameters.client_id;
    console.log(client_id);

    var stripe_id = null;

    try{
        var connection = mysql_connecton();
    }catch(err){
        console.log(err);
    }

    try{
        const get_customerid = await get_stripeid(client_id,connection);
        console.log(get_customerid);
            if(get_customerid.length>0){
                stripe_id = get_customerid[0];
                connection.end();
            }else{
                return Response(400,{'status':400,'data':'Stripe id is not found.'});
            }
    }catch(err){
        console.log(err);
        connection.end();
        return Response(400,{'status':400,'data':err});
    }
    
    try{
        const invoices = await stripe.invoices.list({customer:stripe_id});
        console.log(invoices);
        let output = invoices.data.map((itr)=>{
            return {
                "id":itr.id,
                "object":itr.object,
                "account_country":itr.account_country,
                "account_name":itr.account_name,
                "amount_due":itr.amount_due,
                "amount_paid":itr.amount_paid,
                "amount_remaining":itr.amount_remaining,
                "billing_reason":itr.billing_reason,
                "collection_method":itr.collection_method,
                "created":itr.created,
                "currency":itr.currency,
                "customer":itr.customer,
                "customer_email":itr.customer_email,
                "customer_name":itr.customer_name,
                "default_payment_method":itr.default_payment_method,
                "hosted_invoice_url":itr.hosted_invoice_url,
                "invoice_pdf":itr.invoice_pdf,
                "status":itr.status
                }
        });
        return Response(200,{'status':200,'data':output});
    }catch(err){
        console.log(err);
    }
    
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

const get_stripeid = (client_id,connection)=>
    new Promise((resolve,reject)=>{
        let list_query = 'select stripeID from employer where emp_id ='+client_id; 
        connection.query(list_query,function(err,res){
            if(err){
                reject(err);
            }else{
                resolve(res);
            }
        });
    });    
    
    