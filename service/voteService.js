var path = require('path');
var httpReq = require('../libs/http');
var fs = require('fs');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('../config.default.js');
var Excel = require('exceljs');
const uuidv1 = require('uuid/v1');
var MongoClient = require('mongodb').MongoClient;
var url = config.mongodburl;
var mainService = require('./mainService');
//======================导入=====================
HttpUtils = new httpReq(config.oapiHost);
//======================自动执行=================
let service = {
    saveVote(vote) {
        return new Promise(function (resolve, reject) {
            let id = uuidv1().replace(/-/g, '');
            vote.id = id;
            MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("anheEApp");
                dbo.collection("vote").insertOne(vote, function (err, res) {
                    if (err) throw err;
                    db.close();
                    resolve(vote);
                });
            });
        });

    },
    getVote(queryObj) {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("anheEApp");
                dbo.collection("vote").find(queryObj).toArray(function (err, result) { // 返回集合中所有数据
                    if (err) throw err;
                    resolve(result);
                    db.close();
                });
            });
        });

    },
    senLinkMsg(accessToken, userList, msg) {
        return new Promise((resolve,reject)=>{
            let useridList=userList.map(function (item) {
                return item.userId;
              });
            HttpUtils.post("/topapi/message/corpconversation/asyncsend_v2", {
                "access_token": accessToken
            }, {
                agent_id: config.angentId,
                userid_list: useridList.join(','),
                msg
            }, function (err, body) {
                if (!err) {
                    resolve(true);
                    console.log('群消息发送成功');
                } else {
                    reject(false);
                    console.log('获取用户信息失败');
                }
    
            });
        });
         
    },
    async exportTemp(accessToken, deptList) {
        const workbook = new Excel.Workbook();
        workbook.creator = 'test';
        workbook.lastModifiedBy = 'test';
        workbook.created = new Date();
        workbook.modified = new Date();
        let sheet = workbook.addWorksheet('股东信息表');

        sheet.columns = [
            { header: '用户id', key: 'userid', width: 35 },
            { header: '用户姓名', key: 'name', width: 15 },
            { header: '股份', key: 'weight', width: 15 },
            { header: '人员类别标志（1：管理员，2：监票员候选人，空：普通人员）', key: 'managerflag', width: 50 }
        ];

        let data = await mainService.getDeptUser(accessToken, deptList);
        let weightArr =  mainService.deepCopy(global.gloablField.weightArr||[]);
        weightArr.map(item => {
            item['userid']=item['id']
            delete item['id'];
        })
        let dataResult = weightArr;
        data.forEach(element => {
            // console.log(element);
            dataResult.push(...element);
        })
        data = [...new Set(dataResult)];
        data = mainService.unique(data, 'userid');
        // let getUserListByDeptId = new Promise(function (resolve, reject) {
        //     HttpUtils.get("/user/simplelist", {
        //         "access_token": accessToken,
        //         "department_id": deptid
        //     }, function (err, body) {
        //         if (!err) {
        //             resolve(body)
        //         } else {
        //             console.log('获取用户列表失败');
        //             reject('获取用户列表失败');
        //         }

        //     });
        // });
        // let data = await getUserListByDeptId;
         const excelRowData = data;
         sheet.addRows(excelRowData);
         return workbook.xlsx.writeBuffer();
    },
    /**
     * 获取企业自定义空间
     */
    getSpaceID(accessToken) {
        return new Promise(function (resolve, reject) {
            HttpUtils.get("/cspace/get_custom_space", {
                "access_token": accessToken,
                "domain": 'test',
                "agent_id": config.angentId,
            }, function (err, body) {
                if (!err) {
                    resolve(body.spaceid)
                } else {
                    console.log('获取spaceid失败');
                    reject('获取spaceid失败');
                }

            });
        });

    },
    authorization(accessToken, userID) {
        return new Promise(function (resolve, reject) {
            HttpUtils.get("/cspace/grant_custom_space", {
                "access_token": accessToken,
                "type": 'add',
                "agent_id": config.angentId,
                "userid": userID,
                "path": '/',
                "duration": 3600,
                "domain": 'test'
            }, function (err, body) {
                if (!err) {
                    resolve(body)
                } else {
                    console.log('获取钉盘上传文件失败');
                    reject('获取钉盘上传文件失败');
                }

            });
        });
    },
    hadleExcel(filePath) {
        var workbook = new Excel.Workbook();
        let userWeightData = [];
        workbook.xlsx.readFile(filePath)
            .then(function (fileData) {
                var worksheet = workbook.getWorksheet(1);
                let rowValue = null;
                worksheet.eachRow(function (row, rowNumber) {
                    if(rowNumber!=1) {
                    rowValue = row.values;
                    let weightOne = {
                        "id": rowValue[1],
                        "name": rowValue[2],
                        "weight": rowValue[3],
                        "managerflag":rowValue[4]
                    };
                    userWeightData.push(weightOne);
                }
                });
                //保存读取的权重对象
                MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
                    if (err) throw err;
                    var dbo = db.db("anheEApp");

                    dbo.collection("weight").find({}).toArray(function (err, result) { // 返回集合中所有数据
                        if (err) throw err;
                        if (result.length > 0) {
                            //记录数大于0执行更新操作
                            let _id = result[0]._id;
                            var updateStr = { $set: { "weightArr": userWeightData } };
                            dbo.collection("weight").updateOne({ "_id": _id }, updateStr, function (err, res) {
                                if (err) throw err;
                                dbo.collection("weight").find({}).toArray(function (err, result) { // 返回集合中所有数据
                                    if (err) throw err;
                                    let weightArr = result[0].weightArr;
                                    global.gloablField.weightArr = weightArr;
                                    db.close();
                                });
                            });
                        } else {
                            //执行新增操作
                            dbo.collection("weight").insertOne({ "weightArr": userWeightData }, function (err, res) {
                                if (err) throw err;
                                dbo.collection("weight").find({}).toArray(function (err, result) { // 返回集合中所有数据
                                    if (err) throw err;
                                    let weightArr = result[0].weightArr;
                                    global.gloablField.weightArr = weightArr;
                                    db.close();
                                });
                            });
                        }

                    });


                });

            });
    },
    saveOrUpdatePersonVote(parlist,monList, voteid) {
        let userlist=mainService.deepCopy(parlist);
        let monitorList = mainService.deepCopy(monList);
        monitorList.map(item => {
            item['userId']=item['id']
            delete item['id'];
            delete item['managerflag'];
            delete item['weight'];
        });
        return new Promise((resolve,reject)=>{
             //保存用户参与表决的信息
        MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
            if (err) throw err;
            var dbo = db.db("anheEApp");
            dbo.collection("personVote").find({}).toArray(function (err, result) { // 返回集合中所有数据
                if (err) {reject(false);throw err;}
                if (result.length > 0) {
                    //记录数大于0执行更新操作
                    let userVotelist = result[0].userlist;//数据库中取出的人员关联表决信息
                    let _id = result[0]._id;
                    //遍历比对从应参与投票用户列表和数据库personVote中的用户列表，合并后存入数据库。
                    userlist.forEach(user => {
                        let userId = user.userId;
                        for (let userVote of userVotelist) {
                            if (userId == userVote.userId) {
                                let state = config.VOTESTATEOK;
                                userVote.voteList.push(voteid);
                                break;
                            }
                            if (userVotelist[userVotelist.length - 1] == userVote) {
                                let voteList = [];
                                let monitList = [];
                                user.voteList = voteList;
                                user.monitList=monitList;
                                userVotelist.push(user);
                            }
                        }
                    });
                    monitorList.forEach(monitor=>{
                        let userId=monitor.userId;
                        for (let userVote of userVotelist) {
                            if (userId == userVote.userId) {
                                userVote.monitList.push(voteid);
                                break;
                            }
                            if (userVotelist[userVotelist.length - 1] == userVote) {
                                let monitList = [];
                                let voteList = [];
                                monitor.monitList = monitList;
                                monitor.voteList=voteList;
                                userVotelist.push(monitor);
                            }
                        }
                    });
                    var updateStr = { $set: { "userlist": userVotelist } };
                    dbo.collection("personVote").updateOne({ "_id": _id }, updateStr, function (err, res) {
                        if (err) throw err;
                        db.close();
                        resolve(true);
                    });
                } else {
                    //执行新增操作
                    userlist.forEach(user => {
                        let voteList = [];
                        let monitList=[];
                        voteList.push(voteid);
                        user.voteList = voteList;
                        user.monitList=monitList;
                    });
                    monitorList.forEach(monitor=>{
                        let userId=monitor.userId;
                        for (let userVote of userlist) {
                            if (userId == userVote.userId) {
                                userVote.monitList.push(voteid);
                                break;
                            }
                            if (userlist[userlist.length - 1] == userVote) {
                                let voteList = [];
                                let monitList=[];
                                monitor.monitList = monitList;
                                monitor.voteList=voteList;
                                userlist.push(monitor);
                            }
                        }
                    });
                    dbo.collection("personVote").insertOne({ userlist }, function (err, res) {
                        if (err) throw err;
                        db.close();
                        resolve(true);
                    });
                }
            });


        });
        });
       
    },
    getPersonVote() {
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("anheEApp");
                dbo.collection("personVote").find({}).toArray(function (err, result) { // 返回集合中所有数据
                    if (err) throw err;
                    resolve(result[0]);
                    db.close();
                });
            });
        });
    },
    getUserListByDept(deptId, access_token) {
        return new Promise(function (resolve, reject) {
            HttpUtils.get("/user/simplelist", {
                "access_token": access_token,
                "department_id": deptId,
                "agent_id": config.angentId,
            }, function (err, body) {
                if (!err) {
                    resolve(body)
                } else {
                    console.log('获取部门用户失败');
                    reject('获取部门用户失败');
                }

            });
        });

    },
    handelVote(voteId, userId, userName, voteDeatil, weight) {
        let updateStr = {
            $addToSet: { "vote.votedUserIdList": { userId, userName } },
            $inc: {
                "vote.alreadyWeight":weight
            },
        }
        for (let one of voteDeatil) {
            one.optarr.forEach((optOne,optOneidx)=>{
                if(optOne){
                    updateStr.$inc["vote.discussionList." + one.disIndex + ".options." + optOneidx + ".votes"] = weight;
                    updateStr.$addToSet["vote.discussionList." + one.disIndex + ".options." + optOneidx + ".userIds"] = { userId, userName, weight };
                }
            }); 
        }
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("anheEApp");
                dbo.collection("vote").updateOne({ "id": voteId }, updateStr, function (err, res) {
                    if (err) throw err;
                    db.close();
                    resolve('0');
                });
            });
        });
    },
    updateVote(queryObj,updateObj){
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
                if (err) { reject(false);throw err;}
                var dbo = db.db("anheEApp");
                dbo.collection("vote").updateOne(queryObj, updateObj, function (err, res) {
                    if (err) throw err;
                    db.close();
                    resolve(true);
                });
            });
        });
    },
    saveOriginal(original){
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
                if (err) { reject(false);throw err;}
                var dbo = db.db("anheEApp");
                dbo.collection("original").insertOne(original, function (err, res) {
                    if (err) throw err;
                    db.close();
                    resolve(original);
                });
            });
        });
    },
    getOriginal(queryObj){
        return new Promise(function (resolve, reject) {
            MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
                if (err) throw err;
                var dbo = db.db("anheEApp");
                dbo.collection("original").find(queryObj).toArray(function (err, result) { // 返回集合中所有数据
                    if (err) throw err;
                    resolve(result);
                    db.close();
                });
            });
        });
    }

}
module.exports = service;