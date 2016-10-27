layui.use(['form', 'layedit', 'laydate', 'upload'], function(){
  var form = layui.form()
  ,layer = layui.layer
  ,laydate = layui.laydate;
    
  //监听提交
  form.on('submit(demo1)', function(data){
	var fData = JSON.parse(JSON.stringify(data.field));
	var daString = '';
	for(var i in fData){
		daString += i+'='+fData[i]+'&';
	}
    sendData("add",daString,function(ret){
		if(ret == "success") {
			layer.alert('成功添加');
		}
	}); 
    return false;
  });
  
  layui.upload({
    url: '/upload' //上传接口
    ,success: function(res){ //上传成功后的回调
		console.log(res.path);
		$('input[name=img]').val(res.path);
	}
  });
  
});
