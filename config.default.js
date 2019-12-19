module.exports = {
    port:"8080",
    oapiHost: 'https://oapi.dingtalk.com',
    // appkey: 'ding3rshvth5dvkennuo', 
    appkey: 'ding45k7jzzaazg6stmg', 
    // appsecret: 'PdU597wy0qhr4TiWmq1q958z1WeS41QUAGNEk7Y4n9-K1OX8pZG2MoX1pHhUSo5v',
    appsecret: '83jbe4urD1dJndTAjcJHWbflgEQ8oPCYlX50UGT78FVU_Zg_e_Ewi4ikNQXh-vYI',
    exportUsersDeptId:'97195324',//导出excel的部门id
    mongodburl:'mongodb://localhost:27017/',
    angentId:'334181686',
    // angentId:'307182050',
    VOTESTATEOK:'0',//正常
    VOTESTATEOT:'1',//结束
    VOTESTATECP:'2',//已参与
    VOTESTATEDL:'3',//已删除
    VOTESTATEBF:'4',//未开始
    SYSYEMERRORCODE_LOGINFO_TIMEOUT:'-1',//登录信息过期
    USERTYPE_MANAGER:'1',//用户类型标志-管理员
    USERTYPE_MONITOR:'2',//用户类型标志-监票员
    err:{
        ok:{
            code:"0",
            msg:"成功"
        },
        logTimeout:{
            code:"3",
            msg:"登录超时，请重新打开应用登录！"
        },
        reVote:{
            code:"4",
            msg:"请勿重复投票！"
        },
        monitorNumerr:{
            code:"2",
            msg:"票选监督员候选人数不足"
        },
        serverErr:{
            code:"-1",
            msg:"服务器异常"
        },
        msgNotReceiveErr:{
            code:"5",
            msg:"表决人员全部已参加，通知人员列表为空！"
        }
    }
}
