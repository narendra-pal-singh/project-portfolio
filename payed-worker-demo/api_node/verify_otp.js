var http = require("https");

var mobile_no = '918887955401';

var options = {
  "method": "GET",
  "hostname": "control.msg91.com",
  "port": null,
  "path": "/api/verifyRequestOTP.php?authkey=305421AzdYVyiTMhm5dda5bbb&mobile="+mobile_no+"&otp=3944",
  "headers": {}
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    var bodyObj = JSON.parse(body);
    console.log(body.toString());
    if(bodyObj.type == "success"){
        console.log("verify");
    }else{
        console.log("invalid");
    }
  });
});

req.end();