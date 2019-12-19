var app = require('../app.js');
var mainService = require('../service/mainService.js');
//获取部门列表
app.use('/getDeptInfo', function (req, res, next) {
   let tokenPromise=mainService.getAccessToken();
   tokenPromise.then((data)=>{
      console.log("accessToken"+data.access_token);
   });
}); 