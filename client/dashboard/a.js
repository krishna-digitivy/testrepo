// const aws = require('aws-sdk');
// const moment = require('moment-timezone');
// const dynamodb = aws.DynamoDB();


// // find users created in the last week from current date and 
// //update  newUser as true
// exports.handler = async(event)=>{
    
//     let input = event.input;
//     let today_date = moment().formate('YYYY-MM-DD');
//     let last_week  = moment().diff(today_date).formate('YYYY-MM-DD');

//     try{
//         const get_all_users = await getusersdata(input,today_date,last_week);
//         console.log(get_all_users[0].Items);
//     }catch(err){
//         console.log(err);
//     }

// }

// const getusersdata =  (input,date,last_week)=>
//     new Promise((resolve,reject)=>{
//         let get_users = {
//             TableName : 'users',
//             ExpressionAttributeName:{
//                 'PrimaryKey' : '#pk',
//                 'created_at'       : '#date'
//             },
//             ExpressionAttributeValues:{
//                 ':primarykey'       : input,
//                 ':inputdata'        :  date,
//                 ':lastweek'         :  last_week
//             },
//             KeyConditionExpression:'#pk = :pk and created_at between(:inputdata,:lastweek)',
//         };
    
//         dynamodb.query(get_users,function(err,res){
//             if(err){
//                 reject(err);
//             }else{
//                 resolve(res);
//             }
//         });
//     });



//A retail company wants to analyze their sales data to find the top three products that have generated the highest revenue. 
//They have a database of sales data, which contains the product IDs and their corresponding sales figures for each day.
// Write a function to find the product IDs of the top three products that have generated the highest revenue. 
//nput: sales_data = [(1, 1000), (2, 200), (3, 3000), (4, 400), (5, 500), (6, 600), (7, 700), (8, 800)] 
//Output: [3, 1, 8] 

// let sales_date = [{'id':1, 'value':1000}, {'id':2, 'value':200}, {'id':3, 'value':3000}, {'id':4, 'value':400}, {'id':5, 'value':500}, {'id':6, 'value':600}, {'id':7, 'value':700}, {'id':8, 'value':800}] ;


// function get_top_products(sales_date){
//     sales_date.sort((a,b)=>{
//        return a.value - b.value; 
//     });
//     return sales_date;
// }

// get_top_products(sales_date);

// let table = 'candidate';
// let coulmn = 'c_id'
// let id = 845;
// let a = "SELECT * FROM " + table + " INNER JOIN candidatereviews  WHERE `" + table+'.'+coulmn + "` = " + id + " LIMIT 1";
// SELECT * FROM  candidate JOIN candidatereviews  WHERE candidate.c_id = 815 LIMIT 1;
// console.log(a);

let d = false;

if(d){
    console.log('enter0');
}else{
    console.log('hello');
}
