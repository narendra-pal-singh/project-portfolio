
/*
const request = require('request');

request('https://api.razorpay.com/v1/payouts?api_key=DEMO_KEY', { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
  console.log(res.body);
  console.log(body.url);
  console.log(body.explanation);
});
*/
const https = require('https');

      var paytmParams = {};

        paytmParams["orderId"]            = "WITHDRAW_1";
        paytmParams["purpose"]            = "SALARY_DISBURSEMENT";
      

        var post_data = JSON.stringify(paytmParams);

        var options = {
    
            /* for Staging */
            hostname: 'api.razorpay.com',
    
            /* for Production */
            // hostname: 'dashboard.paytm.com',
    
            path: '/v1/payouts',
            port: 443,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                //'x-mid': x_mid,
                //'x-checksum': x_checksum,
                'Content-Length': post_data.length
            }
        };
    
        var response = "";
        var post_req = https.request(options, function(post_res) {
            post_res.on('data', function (chunk) {
                response += chunk;
            });
    
            post_res.on('end', function(){
                
                //FAILURE, ACCEPTED, SUCCESS, CANCELLED, PENDING, and QUEUED.

                const RES = JSON.parse(response);

                console.log('PAYTM Send Money Response: ', RES);

                callback(null,RES)

                // if(RES.status == "ACCEPTED"){
                //     callback(null,RES)
                // }else{
                //     callback('Send Money Fail');
                // }
              
                
            });
        });
    
        post_req.write(post_data);
        post_req.end();
        post_req.on('error',function(e){
            callback(e);
        });