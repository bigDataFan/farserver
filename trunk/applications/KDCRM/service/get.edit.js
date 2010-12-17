
var cosumer = {
	"基本信息":  {
		"名称": "",
		"简称":"",
		"客户类型": ["企业客户","个人客户"],
		"信用等级": ["低","中","高"],
		"价值评估": ["低","中","高"],
		"客户热度": ["低","中","高"],
		"关系等级": ["低","中","高"]
		},

	"联系方式" : {
			"地址":"",
			"邮编":"",
			"固定电话":"",
			"移动电话":"",
			"即时通讯":"",
			"电子邮件":"",
			"网址":""
	},
	"个人信息" : {
			"姓名":"",
			"性别":""
	},
	"企业信息": {
		"行业":"",
		"规模":""
	}
}

var types = {
		"cosumer":cosumer
}
var model;
if (params.id!=null) {
	model = db.getCollection(params.type).getById(params.id))
} else {
	model = types[params.type];
}


model;



