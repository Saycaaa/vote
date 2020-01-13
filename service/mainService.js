var httpReq = require('../libs/http');
var config = require('../config.default.js');
var sha1 = require('js-sha1');
var MongoClient = require('mongodb').MongoClient;
var url = config.mongodburl;
//======================导入=====================
HttpUtils = new httpReq(config.oapiHost);
//======================自动执行=================
let service = {
    getAccessToken() {
        let access_token = undefined;
        let tokenPromise = new Promise(function (resolve, reject) {
            HttpUtils.get("/gettoken", {
                "appkey": config.appkey,
                "appsecret": config.appsecret,
            }, function (err, data) {
                if (!err) {
                    resolve(data);
                }
                else {
                    console.log('获取access_token失败');
                    reject(err);
                }
            });
        });

        return tokenPromise;
    },
    getWeitArr() {
        MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            var dbo = db.db("anheEApp");
            dbo.collection("weight").find({}).toArray(function (err, result) { // 返回集合中所有数据
                if (err) throw err;
                if (result[0]) {
                    let weightArr = result[0].weightArr;
                    global.gloablField.weightArr = weightArr;
                }
                db.close();
            });
        });
    },
    /**
     * 
     * @param {*} userId 
     * @returns {*} userWeight 包含用户权重，用户id，用户名，用户管理员标志
     */
    getUserWeight(userId) {
        let weightArr = global.gloablField.weightArr;
        if (weightArr) {
            for (one of weightArr) {
                if (one.id == userId) {
                    let userWeight = one;
                    return userWeight;
                }
            }
        }
        return 0
    },
    getUserManagerFlag(userId) {
        let weightArr = global.gloablField.weightArr;
        if (weightArr) {
            for (one of weightArr) {
                if (one.id == userId) {
                    let re = one.managerflag;
                    return re;
                }
            }
        }
        return 0
    },
    getAccessToken() {
        return new Promise(function (resolve, reject) {
            HttpUtils.get("/gettoken", {
                "appkey": config.appkey,
                "appsecret": config.appsecret,
            }, function (err, body) {
                if (!err) {
                    var accessToken = body.access_token;
                    resolve(accessToken);
                } else {
                    console.log('获取access_token失败');
                    reject(err);
                }
            });
        });

    },
    getAllDept(access_token) {
        return new Promise(function (resolve, reject) {
            HttpUtils.get("/department/list", {
                "fetch_child": true,
                "access_token": access_token,
            }, function (err, body) {
                if (!err) {
                    resolve(body.department);
                } else {
                    console.log('获取所有部门失败');
                    reject(err);
                }
            });
        });

    },
    async getDeptUser(access_token, departmentList) {
        let promiseArr = [];
        departmentList.forEach(dept => {
            let did = dept.id;
            let p = new Promise(function (resolve, reject) {
                HttpUtils.get("/user/simplelist", {
                    "department_id": did,
                    "access_token": access_token,
                }, function (err, body) {
                    if (!err) {
                        resolve(body.userlist);
                    } else {
                        console.log('获取所有部门失败');
                        reject(err);
                    }
                });
            });
            promiseArr.push(p);
        });
        return await Promise.all(promiseArr);

    },
    unique(arr1, feild) {
        const res = new Map();
        return arr1.filter((a) => !res.has(a[feild]) && res.set(a[feild], 1))
    },
    deepCopy(obj) {
        var result = Array.isArray(obj) ? [] : {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    result[key] = this.deepCopy(obj[key]);   //递归复制
                } else {
                    result[key] = obj[key];
                }
            }
        }
        return result;
    },
    getTotalWeight(list){
        let totalWeight=0;
        let weiArr=global.gloablField.weightArr;
        list.forEach((item)=>{
            weiArr.some((one)=>{
                if(item.userId==one.id){
                    totalWeight+=one.weight;
                    return true;
                }
            });
        });
        return totalWeight;
    },
    getMonitorList(monitorNum){
        //用户信息保留在全局对象中
        const weiArr=global.gloablField.weightArr;
        let monitorPool= weiArr.filter((one)=>{
            return one.managerflag==config.USERTYPE_MONITOR? true:false;
        });
        let monitorList=[];
        if(monitorNum>monitorPool.length){
            return {
                state:false,
                result:[]
            };
        }
        for(let i=0;i<monitorNum;i++){
            let random= Math.floor(Math.random()*monitorPool.length);
            monitorList.push(monitorPool[random]);
            monitorPool.splice(random,1);
        }
        return {
            state:true,
            result:monitorList
        };
    },
    //数组去重,在数组1中去除与数组2满足isEq的元素
    //参数：数组1，数组2，相等函数
    arrSetful(arr1,arr2,isEq){
        isEq=isEq||function(v1,v2){
            return v1==v2;
        }
        for(let i=arr1.length-1;i>=0;i--){
            for(let j=arr2.length-1;j>=0;j--){
                if(isEq(arr1[i],arr2[j])){
                    arr1.splice(i,1);
                    break;
                }
            }
        }
        return arr1;
    }

}
module.exports = service;