//https://api.msg91.com/apidoc/sendotp/retry-otp.php

var http = require("https");

//var otp = Math.floor(100000 + Math.random()*90000);

//var msg = encodeURIComponent("Payd OTP is " + otp + ". Use this to verify your mobile - Payd.co.in");

var mobile_no = '918887955401';

var options = {
"method": "GET",
"hostname": "control.msg91.com",
"port": null,
"path": "/api/sendotp.php?authkey=305421AzdYVyiTMhm5dda5bbb&sender=WHNOWR&mobile="+mobile_no+"&otp_length=6",
"headers": {
    "content-type": "application/json"
}
};

var req = http.request(options, function (res) {
    var chunks = [];

    res.on("data", function (chunk) {
        chunks.push(chunk);
    });

    res.on("end", function () {
        var body = Buffer.concat(chunks);
        
        console.log("OTP Data = ",body.toString());

        var bodyObj = JSON.parse(body);

        if(bodyObj.type == "success"){
            console.log("OTP Sent = ");
            return true;
        }else{
            console.log("OTP fail");
            return false;
        }
        
    });
});

// req.write("{\"Value1\":\"Param1\",\"Value2\":\"Param2\",\"Value3\":\"Param3\"}");
req.end();

