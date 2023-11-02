const uuid        = require('uuid').v4();
// let a = uuid.v4();

// const partner_id = 'CLIENT#'+uuid;
// console.log(partner_id);

let event = 'candidates';

// let query = null;
let email = 'k@gmail.com';
let query = (event === 'podprovider') ? query = `insert into ${event}(email,partner_code) values(${email},PARTNER#${uuid})`: 
       (event === 'employer') ? query = `insert into ${event}(email,partner_code) values(${email},CLIENT#${uuid})` : 
       `insert into ${event}(email) values(${email})`;


// if(code!=null){
    console.log(query);
// }



// if (event === 'podprovider'){
//     code = `PARTNER#${uuid}`;
// }else if(event === 'employer'){
//     code = `CLIENT#${uuid}`;
// }


// console.log(code);
