/**
 * @f 方法
 * @d 数据
 * @cb 回调函数
 */
function sendData(f, d, cb){
	$.ajax({
		url: "http://"+location.host+"/vote/"+f,
		type: "GET",
		data : d,
		success:function(data){
			if(typeof(cb) == "function") cb(data);
		} 
	});
}

/**
 * @name 名字
 * @value 值
 * @seconds 时间秒
 */
function setCookie(name, value, seconds) {
	var exp = new Date();
	exp.setTime(exp.getTime() + seconds*1000);
	document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

/**
 * @cookie_name 名字
 */
function getCookie(cookie_name){
	var results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');
	if (results) return (unescape(results[2]));
	else return null;
}

