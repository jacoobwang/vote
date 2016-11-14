var ua = navigator.userAgent;
var isIphone = ua.match(/(iPhone\sOS)\s([\d_]+)/),
    isAndroid = ua.match(/(Android)\s+([\d.]+)/),
    isMobile = isIphone || isAndroid;
if(!isMobile) {
    $('body').html('<p style="width:300px;height:30px;margin:220px auto;color:red;font-size:20px;">请在手机中访问该页面</p>')
}

var DomList = 
{
	"succ" : ".success",
	"res"  : ".result",
	"mark" : ".mark"
}

sendData('vote','num=1',function(ret){	
	if(ret.length>0){
		var li = '',btn_class='disable';
		var author = {1:'Nancy',2:'Nicoe',3:'Jacoob',4:'YoYo'};	
		for(var i in ret){
			if(ret[i]['master']=="on"){
				li += '<li class="box"><div class="vo '+ret[i]['color']+'">'+ret[i]['title']+'</div><div class="word"><div class="btn on">打分</div><div class="author">'+author[ret[i]['author']]+'</div></div></li>';
			}else{
				if(ret[i]['title'].length==0){
					li += '<li class="box"><div class="vo '+ret[i]['color']+'"></div><div class="word"><div class="btn disable">打分</div><div class="author">'+author[ret[i]['author']]+'</div></div></li>';	
				}
				else{	
					li += '<li class="box"><div class="vo '+ret[i]['color']+'">'+ret[i]['title']+'</div><div class="word"><div class="btn '+btn_class+'">'+ret[i]['mark']+'</div><div class="author">'+author[ret[i]['author']]+'</div></div></li>';
				}	
			}
		}
		$("ul.content").html(li);
		var isVote= getCookie("voted") || false;
		if(isVote){
			$(".on").html("投票中...");
			setCookie("voted",true,60);
		}
		reloadData();
		init();
	}	
});

//reloadData();

$(function(){
	FastClick.attach(document.body);
});

function init(){
	//打分按钮点击
	$(".btn").on("click",function(){
		var isDis = $(this).hasClass("disable");
		var isVote= getCookie("voted") || false;
		if(isDis == false && isVote == false){
			//可点击
			showToast(DomList["mark"]);
		}
		return false;
	});

	$(".toast").on("click",function(){
		return false;
	});

	//提交
	$(".mark a").on("click",function(){
		var obj = {
			"num" : $(".mark input").val()
		}
		if(obj.num>0 && obj.num < 10){
			sendData("mark","num="+obj.num,doVote);
		}else{
			$("#error").html("输入分值不合法，请重新输入").show();
			setTimeout(function(){$("#error").hide();},3000);
		}
	});

	//点击弹窗以外区域关掉弹窗	
	$(document).on("click",function(){
		hideToast();		
	});
}

function doVote(){
	hideToast();
	showToast(DomList["succ"]);
	$(".on").html("投票中...");
	setCookie("voted",true,60);
	window.r = setInterval('reloadData()',3000);
}

function reloadData(){
	sendData("markrs","",function(data){
		if(data > 0){
			var rs = Math.ceil(data*10)/10;
			$(".on").html(rs);
			setCookie("voted",true,60);
			if(window.r != undefined) clearInterval(r);
		}
	})
}

function hideToast(){
	if($(".floater").css("display") == "block"){	
		$(".floater").hide();
		for(var i in DomList){
			$(DomList[i]).hide();
		}
	}
}
/**
 * @DomID 弹出层dom
 **/
function showToast(DomID){
	$(".floater").show();
	console.log(DomID);
	$(DomID).show();
}

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

