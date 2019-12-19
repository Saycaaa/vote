var httpReq = require('./libs/http');
var contentDisposition = require('content-disposition');
var express = require('express');
var path = require('path');
var fs = require('fs');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var formidable = require('formidable');
var date = require("silly-datetime");
const uuidv1 = require('uuid/v1');
var app = express();

var config = require('./config.default.js');
var voteService = require('./service/voteService.js');
var mainService = require('./service/mainService.js');
//===================================导入==================
//===================================变量及插件==================
const TEMPLATE_DEPTID = '141633332';

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });
app.use(logger('short', { stream: accessLogStream }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
//使用session
app.use(session({
    secret: 'secret', // 对session id 相关的cookie 进行签名
    resave: true,
    saveUninitialized: false, // 是否保存未初始化的会话
    cookie: {
        maxAge: 1000 * 120 * 60, // 设置 session 的有效时间，单位毫秒
    },
}));
HttpUtils = new httpReq(config.oapiHost);
//初始化全局变量--用于保存全局使用的一些对象
global.gloablField = {};
//初始化股东股份权重数组
mainService.getWeitArr();
//====================================处理http请求========================
// 获取用户信息
app.use('/login', function (req, res) {
    // 获取access_token
    HttpUtils.get("/gettoken", {
        "appkey": config.appkey,
        "appsecret": config.appsecret,
    }, function (err, body) {
        if (!err) {
            var code = req.body.authCode;
            var accessToken = body.access_token;
            //获取用户id 
            HttpUtils.get("/user/getuserinfo", {
                "access_token": accessToken,
                "code": code,
            }, function (err2, body2) {
                if (!err2) {
                    //获取用户详细信息
                    HttpUtils.get("/user/get", {
                        "access_token": accessToken,
                        "userid": body2.userid,
                    }, function (err3, body3) {
                        if (!err3) {
                            let userWeight = mainService.getUserWeight(body2.userid)
                            req.session.logInfo = {
                                "userId": body2.userid,
                                "userName": body3.name,
                                "access_token": accessToken,
                                "weight": userWeight.weight,
                                "managerflag": userWeight.managerflag
                            };
                            // res.send({
                            //     result: {
                            //         userId: body2.userid,
                            //         userName: body3.name,
                            //         weight: req.session.logInfo.weight,
                            //         managerflag: req.session.logInfo.managerflag
                            //     }
                            // });
                            result = {
                                userId: body2.userid,
                                userName: body3.name,
                                weight: req.session.logInfo.weight,
                                managerflag: req.session.logInfo.managerflag
                            }
                            res.send({ status: config.err.ok, data: result });
                        } else {
                            res.send(config.err.serverErr);
                            console.log('获取用户信息失败');
                        }

                    });
                } else {
                    res.send(config.err.serverErr);
                    console.log('获取用户id失败');
                }

            });
        } else {
            res.send(config.err.serverErr);
            console.log('获取access_token失败');
        }
    });

});
//发布新问卷
app.use('/buildNewVote', async function (req, res) {

    let param = JSON.parse(req.body.param);
    try {
        let a = new Promise((resolve, reject) => {
            HttpUtils.get("/gettoken", {
                "appkey": config.appkey,
                "appsecret": config.appsecret,
            }, async function (err, body) {
                if (!err) {
                    var accessToken = body.access_token;

                    // 随机在监票员候选人中选取数名监票员
                    let monitorListObj = mainService.getMonitorList(param.vote.settingObj.setForMonitor.num);
                    if (!monitorListObj.state) {
                        res.send(config.err.monitorNumerr);//代表监票员候选人不足
                        return;
                    }
                    //vote对象保存监票员
                    param.vote.monitorList = monitorListObj.result;
                    //计算应参与投票人数的总股权
                    let totalWeight = mainService.getTotalWeight(param.vote.parUser);
                    //vote对象保存应投票股份数
                    param.vote.totalWeight = totalWeight;
                    param.vote.code = date.format(new Date(), 'YYYYMMDDHHmmss');
                    let vote = await voteService.saveVote(param);
                    if (vote) {
                        res.send(config.err.ok);//成功
                    }
                    else {
                        res.send(config.err.serverErr);//代表服务器出错
                    }
                } else {
                    console.log('获取access_token失败');
                }
            });
        })
    } catch (error) {
        console.log(error);
        res.send(config.err.serverErr);
    }
});
//发布表决
app.use('/release', async function (req, res) {
    try {
        let voteId = req.body.voteId;
        let queryObj = {
            'id': voteId
        }

        let updateObj = {
            $set: {
                "vote.state": config.VOTESTATEOK
            }
        }
        voteService.getVote(queryObj).then(async (vote) => {
            let param = vote[0] || {};
            let msg = {
                "msgtype": "link",
                "link": {
                    "messageUrl": "eapp://page/voteMain/voteMain?voteId=" + voteId,
                    "picUrl": "http://anheeapp.vaiwan.com/static/img/timg.jpg",
                    "title": '投票表决正在进行',
                    "text": "表决（" + param.vote.title + "编号<" + param.vote.code + ">）正在进行，点击进入！>"
                }
            };
            let saveOK = await voteService.saveOrUpdatePersonVote(param.vote.parUser, param.vote.monitorList, voteId);
            if (saveOK) {
                let accessToken = await mainService.getAccessToken();
                let isOk = await voteService.updateVote(queryObj, updateObj);
                let msgOK = await voteService.senLinkMsg(accessToken, param.vote.parUser, msg);
                if (isOk && msgOK) {
                    res.send(config.err.ok);
                } else {
                    res.send(config.err.serverErr);
                }
            } else {
                res.send(config.err.serverErr);
            }
            return;
        });

    } catch (error) {
        console.log(error);
        res.send(config.err.serverErr);//代表请求出错
    }
}),
    //再次通知
    app.use('/sendMsgAgain', async function (req, res) {
        try {
            let voteId = req.body.voteId;
            let queryObj = {
                'id': voteId
            }

            voteService.getVote(queryObj).then(async (vote) => {
                let param = vote[0] || {};
                let msg = {
                    "msgtype": "link",
                    "link": {
                        "messageUrl": "eapp://page/voteMain/voteMain?voteId=" + voteId + '&time=' + new Date().getTime().toString(),
                        "picUrl": "http://anheeapp.vaiwan.com/static/img/timg.jpg",
                        "title": '投票表决正在进行（再次通知）',
                        "text": "表决（" + param.vote.title + "编号<" + param.vote.code + ">）正在进行，点击进入！>"
                    }
                };
                //从参与人员中将已投票人员移除
                let noVoteList = mainService.arrSetful(param.vote.parUser, param.vote.votedUserIdList, function (v1, v2) {
                    return v1.userId == v2.userId;
                });
                if (noVoteList.length == 0) {
                    res.send(config.err.msgNotReceiveErr);
                    return;
                }
                let accessToken = await mainService.getAccessToken();
                let msgOK = await voteService.senLinkMsg(accessToken, noVoteList, msg);
                if (msgOK) {
                    res.send(config.err.ok);
                } else {
                    res.send(config.err.serverErr);
                }
                return;
            });

        } catch (error) {
            console.log(error);
            res.send(config.err.serverErr);//代表请求出错
        }
    }),
    //获取所有表决
    app.use('/voteList', function (req, res) {
        try {
            let queryObj = {
                "vote.state": {
                    $ne: config.VOTESTATEDL
                }
            }
            voteService.getVote(queryObj).then(function (voteList) {
                res.send({ status: config.err.ok, data: voteList });
            }, function () {
                res.send(config.err.serverErr);
                console.log('查询数据库无响应===appjs====line:86');
            });

        } catch (error) {
            console.log(error);
            logger.log(error);
        }
    });
//获取个人参与的表决
app.use('/voteListPersonal', async function (req, res) {
    try {
        let user = JSON.parse(req.body.currentUser);
        let userid = user.id;
        let userVoteList = [];
        let userMonitList = [];
        //获取用户参与的表决数组
        let personVote = await voteService.getPersonVote() || {};

        //{id:{$in:['6a6ba410fed111e992a2d7b234a60517']}}
        for (let userVote of personVote.userlist || []) {
            if (userVote.userId == userid) {
                userVoteList = userVote.voteList;
                userMonitList = userVote.monitList;
                break;
            }
        }
        let queryObjVote = {
            id: { $in: userVoteList }
        }
        let queryObjMoni = {
            id: { $in: userMonitList }
        }
        let voteList = await voteService.getVote(queryObjVote);
        let monitList = await voteService.getVote(queryObjMoni);
        voteList.forEach(vote => {
            vote.vote.votedUserIdList.some(item => {
                if (item.userId == userid) {
                    vote.vote.state2 = config.VOTESTATECP;//设置状态已参与
                    return true;
                }
            });
        });
        res.send(JSON.stringify({ voteList, monitList }));
    } catch (error) {
        res.send(config.err.serverErr);
        console.log(error);
    }
});

// app.use(function(req, res, next) {
//   res.send('welcome')
// });
/**
 * 导出人员信息表
 */
app.use('/exportTemp', function (req, res, next) {
    HttpUtils.get("/gettoken", {
        "appkey": config.appkey,
        "appsecret": config.appsecret,
    }, async function (err, body) {
        if (!err) {
            var accessToken = body.access_token;
            // let deptList = await mainService.getAllDept(accessToken);
            let buff = voteService.exportTemp(accessToken, [{ id: config.exportUsersDeptId }]);
            buff.then((data) => {
                res.setHeader('Content-Type', 'application/octet-stream; charset=utf-8');
                res.set('Content-Disposition', contentDisposition("excel.xlsx"));
                res.end(data);
            });
        } else {
            console.log('获取access_token失败');
            log.err('获取access_token失败');
        }
    });
});

//导入股东股权信息表
app.use('/importTemp', function (req, res, next) {
    try {
        var form = new formidable.IncomingForm();
        form.keepExtensions = true;
        form.uploadDir = __dirname + '/uploads';
        form.parse(req, function (err, fields, files) {

            if (err) {

                console.log('文件上传错误！');

                return;

            }
            var path = files.excel.path;
            var arr = path.split('\\');

            var name = arr[arr.length - 1];

            var url = "/uploads/" + name;
            voteService.hadleExcel(__dirname + url);
        });
        res.send(config.err.ok);
    } catch (error) {
        console.log(error);
    }

});

//获取单个表决对象
app.use('/getVote', function (req, res, next) {
    try {
        let voteId = req.body.voteId;
        let currentUser = req.session.logInfo;
        if (!currentUser) {
            let senObj = {
                status: config.SYSYEMERRORCODE_LOGINFO_TIMEOUT
            }
            res.send(JSON.stringify(senObj));
            return;
        }
        let userId = currentUser.userId;
        let queryObj = {
            id: voteId
        }
        voteService.getVote(queryObj).then(function (vote) {
            let result = vote[0];
            let index = result.vote.votedUserIdList.some(item => {
                if (item.userId == userId) {
                    result.vote.state2 = config.VOTESTATECP;
                    return true;
                }
            });
            res.send(JSON.stringify(result));
        }, function () {
            logger.log('查询数据库无响应===appjs====line:86');
        });

    } catch (error) {
        console.log(error);
        logger.log(error);
    }
});

//处理表决
app.use('/handleVote', async function (req, res, next) {
    try {
        //获取表决参数--表决对象id和表决详情数组
        let param = JSON.parse(req.body.param);
        let voteId = param.voteId;
        let voteDetail = param.voteDetail;
        //获取操作用户--用户id-用户表决权重
        let currentUser = req.session.logInfo;
        if (!currentUser) {
            res.send(config.err.logTimeout);//登录超时
        }
        let userId = currentUser.userId;
        let userName = currentUser.userName;
        let weight = currentUser.weight || 0;
        //判断是否已参与投票，禁止重复投票
        let result = await voteService.getVote({ id: voteId });
        let vote = result[0].vote;
        //判断vote对象已参与人员列表中是否包含当前用户，是则返回重复投票错误代码
        if (vote.votedUserIdList.some((v) => {
            if (v.userId == userId) {
                return true;
            } else {
                return false;
            }
        })) {
            res.send(config.err.reVote);
            return;
        }
        //更新文档数据库--选项投票数增加-投票人员数组更新-选项投票人员更新
        let status = await voteService.handelVote(voteId, userId, userName, voteDetail, weight);
        let a = await voteService.saveOriginal({ voteId, voteDetail, userName, title: vote.title, code: vote.code });
        console.log("表决完成");
        res.send(config.err.ok);
    } catch (error) {
        console.log(error);
        res.send(config.err.serverErr);//代表请求出错
    }
});
//获取当前用户
app.use('/currentUser', async function (req, res, next) {
    try {
        let currentUser = req.session.logInfo;
        if (!currentUser) {
            let senObj = {
                status: config.SYSYEMERRORCODE_LOGINFO_TIMEOUT
            }
            res.send(JSON.stringify(senObj));
            return;
        }
        res.send(JSON.stringify(currentUser));
    } catch (error) {
        console.log(error);
        res.send('1');//代表请求出错
    }
});
//获取用户总股权--根据用户列表参数
app.use('/estimatedWeight', async function (req, res, next) {
    try {
        let voteId = req.body.voteId;
        let vote = (await voteService.getVote({ id: voteId }))[0] || {};
        let totalWeight = mainService.getTotalWeight(vote.vote.parUser);
        res.send({ totalWeight });
    } catch (error) {
        console.log(error);
        res.send('-1');//代表请求出错
    }
});

//表决截止修改表决对象状态
app.use('/voteStop', async function (req, res, next) {
    try {
        let voteId = req.body.voteId;
        let queryObj = {
            'id': voteId
        }
        let updateObj = {
            $set: {
                "vote.state": config.VOTESTATEOT
            }
        }
        let isOk = await voteService.updateVote(queryObj, updateObj);
        if (isOk) {
            res.send(config.err.ok);
        } else {
            res.send(config.err.serverErr);
        }
        return;
    } catch (error) {
        console.log(error);
        res.send('-1');//代表请求出错
    }
});
//删除表决
app.use('/deleteVote', async function (req, res, next) {
    try {
        let voteId = req.body.voteId;
        let queryObj = {
            'id': voteId
        }
        let updateObj = {
            $set: {
                "vote.state": config.VOTESTATEDL
            }
        }
        let isOk = await voteService.updateVote(queryObj, updateObj);
        if (isOk) {
            res.send(config.err.ok);
        } else {
            res.send(config.err.serverErr);
        }
        return;
    } catch (error) {
        console.log(error);
        res.send(config.err.serverErr);//代表请求出错
    }
});

//获取表决原始数据
app.use('/getOriginalVote', function (req, res) {
    try {
        let voteId = req.body.voteId;
        let userName = req.body.searchName;
        userName = new RegExp(userName || '.');
        voteService.getOriginal({ voteId, userName }).then(function (originalList) {
            res.send({ status: config.err.ok, data: originalList });
        }, function () {
            logger.log('查询数据库无响应===appjs====line:394');
        });
    } catch (error) {
        res.send(config.err.serverErr);
        console.log(error);
    }
});

app.use('/static', express.static('static'));
module.exports = app;