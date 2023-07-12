var connection    = require('../database/database');

var SucessResponse = {
    "status": 200,
    "data": "",
};
var ErrorResponse = {
    "status": 400,
    "data": ""
};

exports.handler = async(event) => {

    let pod_id = event.pod_id;
    
    try {
        var candidate = await delete_pod(pod_id);
        console.log(candidate);
        connection.end();
        SucessResponse["data"] = "pod removed!";
        return SucessResponse;
    } catch (err1) {
        ErrorResponse["data"] = err1;
        connection.end();
        return ErrorResponse;
    }
           
};

const delete_pod = (id) =>{    
    return new Promise((resolve, reject) => {
        var query = "select * from pod_activity WHERE pod_id = '"+pod_id+"'";
        connection.query(query, function (err1, res) {
        if (res.length > 0) {
            var query1 = "DELETE FROM pod_activity WHERE pod_id = '" + pod_id + "'";
                connection.query(query1, function (err1, res) {
                    console.log(res, "inner")
                    if (res) {
                        var query1 = "DELETE FROM pods WHERE id = '" + pod_id + "'";
                        connection.query(query1, function (err1, res) {
                            return err1 ? reject(err1) : resolve(res);
                        });
                    }
                return err1 ? reject(err1) : resolve(res);
            });
        }else{
            var query1 = "DELETE FROM pods WHERE id = '" + pod_id + "'";
            connection.query(query1, function (err1, res) {
                console.log(err1,"e")
                return err1 ? reject(err1) : resolve(res);
            });  
        }
    });
});
};