/*
 * @Author: None 
 * @Date: 2017-04-01 11:28:32 
 * @Last Modified by: None
 * @Last Modified time: 2018-01-16 15:54:47
 */
// const sha1 = require('sha1');
// const querystring = require('querystring');
// const uuidv1 = require('uuid/v1');

const filters = {
	'': val => val,
	/**姓名脱敏**/
	tmName: name => name && name.length > 1 ? name.replace(/.(?!$)/g, '*') : name || '',
	/**邮箱脱敏**/
	tmEmail: (mail='') => {
		//固定显示三个*号长度
		return mail.replace(/(.{3}).*(@.*)/g, '$1***$2');
		let prefix = mail.substr(0, 3),
			suffix = mail.split(/@/)[1];
		hideLen = mail.length - suffix.length - 3;
		//非固定长度
		return prefix + new Array(hideLen + 1).join('*') + '@' + suffix;
	},
	/**银行卡脱敏**/
	tmBankCard: str => str && (str.length === 16 || str.length === 19) ? (str.substr(0, 6) + '******' + str.substr(-4, 4)) : str || '',
	tmIdCard: str => str && (str.length === 15 || str.length === 18) ? (str.substr(0, 8) + '*******' + str.substr(-3, 3)) : str || '',
	/**电话或银行卡脱敏
	 ***规则为隐藏银行卡号或手机号的倒数第二个四位数
	 **/
	tmTel: tel => tel && tel.length > 7 ? tel.replace(/\d{4}(?=\d{4}$)/, '****') : tel || '',
	tmCall: tel => tel && tel.length > 7 ? tel.replace(/\d{4}/, '****') : tel || '',
	/*格式化*/
	//格式化时间
	formatTime(d = new Date(), fmt = 'yyyy-MM-dd HH:mm:ss') {
		fmt = fmt === true ? 'yyyy-MM-dd HH:mm:ss' : fmt === false ? 'yyyy-MM-dd' : fmt;
		return utils.format(d, fmt);
	},
	//格式化如下格式的时间201601080952134
	formatTime2(d, fmt) {
		let nv = (d + '00000000000000').substr(0, 14);
		nv = nv.replace(/(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1/$2/$3 $4:$5:$6');
		return filters.formatTime(new Date(nv), fmt);
	},
	//格式化金额值，带逗号,u为单位
	formatMoney: (v, l = 2, u) => isNaN(v) ? v : (v - 0).toFixed(l).replace(l ? /(?!^)(?=(\d{3})+\.\d*)/g : /(?!^)(?=(\d{3})+$)/g, ',') + (u || ''),
	//格式化以分为单位的金额.
	formatMoney2: (v, l = 2, u = ' 元') => filters.formatMoney((v || 0) / 100, l, u),
	//格式化卡号，四位一空格
	formatCard: cardNo => cardNo.replace(/\d{4}/g, '$& '),

}

const utils = {
	timers: {},
	get uuid() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	},
	sortObject(q) {
		let tmp = {};
		Object.keys(q).sort((a, b) => a > b ? 1 : -1).forEach(key => tmp[key] = q[key]);
		return tmp;
	},
	getType(obj) {
		return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
	},
	// hash(obj) {
	// 	switch (this.getType(obj)) {
	// 		case 'object':
	// 			return sha1(querystring.stringify(this.sortObject(obj)));
	// 		case 'string':
	// 		case 'number':
	// 			return sha1(obj + '');
	// 	}
	// 	throw Error('hash计算目前只接受JSON,Number,String三种类型!');
	// },
	getParamJson: function (search) {
		//可接受两个参数
		//无参数时默认返回window.location.search 转换成JSON后的对象
		//1个参数时把此参数当成search看待
		//对多个同名的key不能用.
		var obj = {};
		search = search || window.location.search;
		var arr = search.replace(/^\?/g, '').replace(/\#/g, '').split('&');
		for (var i = 0; i < arr.length; i++) {
			var tmp = arr[i].split('=');
			obj[tmp[0]] = obj[tmp[0]] ? (obj[tmp[0]] instanceof Array) ? obj[tmp[0]].concat(tmp[1]) : [obj[tmp[0]], tmp[1]] : tmp[1];
			obj[tmp[0]] = decodeURIComponent(obj[tmp[0]]);
		}
		return obj;
	},
	//简单倒计时
	countdown: function (name, timeout, ticker) {
		// var timeout=$('[data-countdown]').attr('data-countdown');

		var timer;
		if (utils.timers[name]) {
			timer = utils.timers[name];
		} else {
			function Timer(name, timeout) {
				this.tid = null;
				this.name = name;
				this.timeout = this._timeout = timeout;
			}
			Timer.prototype = {
				reset: function () {
					this.timeout = this._timeout;
				},
				tick: function (fun) {
					var me = this;
					var tick = function () {
						me.timeout -= 1;
						fun && fun(me.timeout);
						if (me.timeout <= 0) {
							me.clearInterval();
							me.reset();
						}
					}
					this.tid && clearInterval(this.tid);
					this.tid = setInterval(tick, 1000);
					tick();
				},
				clearInterval: function () {
					clearInterval(this.tid);
				}
			}
			timer = new Timer(name, timeout);
			utils.timers[name] = timer;
		}
		timer.tick(function (rest) {
			ticker && ticker(rest);
		});
	},
	cookie(name, value, hours, path, domain, secure) {
		if (!value) {
			var reg = eval("/(?:^|;\\s*)" + name + "=([^=]+)(?:;|$)/");
			return reg.test(document.cookie) ? RegExp.$1 : "";
		}
		var cdata = name + "=" + value;
		if (hours) {
			var d = new Date();
			d.setHours(d.getHours() + hours);
			cdata += "; expires=" + d.toGMTString();
		}
		cdata += path ? ("; path=" + path) : "";
		cdata += domain ? ("; domain=" + domain) : "";
		cdata += secure ? ("; secure=" + secure) : "";
		document.cookie = cdata;
	},
	removeCookie(name, path, domain) {
		utils.setCookie(name, "", -1, path, domain);
	},
	sleep(duration) {
		return new Promise(resolve => {
			setTimeout(resolve, duration);
		})
	},
	format(d = new Date(), fmt = 'yyyy-MM-dd HH:mm:ss') {
		d = new Date(d);
		let o = {
			"M+": d.getMonth() + 1,
			"d+": d.getDate(),
			"h+": d.getHours() % 12 == 0 ? 12 : d.getHours() % 12,
			"H+": d.getHours(),
			"m+": d.getMinutes(),
			"s+": d.getSeconds(),
			"q+": Math.floor((d.getMonth() + 3) / 3),
			"S": d.getMilliseconds()
		};
		let week = ['日', '一', '二', '三', '四', '五', '六'];
		if (/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		if (/(E+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[d.getDay()]);
		}
		for (let k in o) {
			if (new RegExp("(" + k + ")").test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}
		return fmt;
	},
	pos(fullPath = true, step = 2) {
		try {
			throw new Error();
		} catch (e) {
			let err = e.stack.split(/^    at /m)[step].replace(/\n|\s/g, '').split('(').pop().split(')')[0];
			console.log(fullPath ? err : err.split('/').pop().split(')')[0]);
		}
	},
	//获取或判断当前平台
	platform(platform) {
		if (platform)
			platform = platform.toLowerCase();
		let u = navigator.userAgent, app = navigator.appVersion;
		let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
		let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
		let p = isAndroid ? 'android' : isIOS ? 'ios' : 'other';
		return platform ? (p == platform) : p;
	}
}

export {
	filters,
	utils
}