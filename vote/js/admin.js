layui.use(['form', 'layedit', 'laydate', 'upload', 'layer'], function(){
  var form = layui.form()
  ,layer = layui.layer
  ,laydate = layui.laydate;
    
  var loading = layer.load(1, {
  	shade: [0.5,'#666']
  });

  //监听提交
  form.on('submit(demo1)', function(data){
	var fData = JSON.parse(JSON.stringify(data.field));
	var daString = '';
	for(var i in fData){
		daString += i+'='+fData[i]+'&';
	}
	if(fData.way == 1){
    	sendData("add",daString,function(ret){
			if(ret == "success") {
				layer.alert('成功添加');
			}
		}); 
	}else{
		if(daString.indexOf("master") <0) daString += 'master=null';
		sendData("update",daString,function(ret){
			if(ret == "success") {
				layer.alert('成功修改');
			}		
		});
	}
    return false;
  });
  
    
  sendData('vote', 'num=1', function(ret){
  	if(ret.length>0){
		var slide = "";
		for(var i in ret){
			if(ret[i]['title'].length==0) ret[i]['title'] = '分享未开始';
			if(i == 0){
				slide += '<p data-id="'+ret[i]['_id']+'" class="on"><span>'+ ret[i]['title'] +'</span><i alt="”删除项目“" class="btn_delete"></i></p>';
			}else{
				slide += '<p data-id="'+ret[i]['_id']+'"><span>'+ ret[i]['title'] +'</span><i alt="”删除项目“" class="btn_delete"></i></p>';
			}
		}
		$('.slide').html(slide);
		$('p',$('.slide')).live("mouseover",function(){
			$(this).find("i").show();
		}).live("mouseout",function(){
			$(this).find("i").hide();
		});
		
		setInput(ret[0], function(){form.render();layer.close(loading)});

		$('p',$('.slide')).live('click',function(){	
			$('p.on').removeClass();
			$(this).addClass('on');
			
			var id = $(this).attr('data-id');
			if(id == undefined){
				setFormDefault(function(){form.render()});
				return;
			}
			sendData('getOne', 'id='+id, function(ret){
				setInput(ret[0], function(){form.render();});
			});	
		});

		$('i',$('.slide')).live('click',function(){
			var $this = $(this);
			layer.confirm('您要删除这个item吗？', {
				btn: ['是的','我再考虑会'] //按钮
			}, function(){
			    //删除
				$($this).parent().remove();
				$('.slide p:first').addClass("on");
				var id = $('.slide p:first').attr('data-id');
				if(id != undefined){
					sendData('delOne', 'id='+id, function(ret){
						setInput(ret[0], function(){form.render();});
					});	
				}
				layer.msg('删除成功');
			}, function(){});
		});
	}else{
		layer.close(loading);	
	}
  });

	$('#create').on('click',function(){
		$('p.on').removeClass();
		$('.slide').prepend('<p class="on"><span>新建分享</span><i alt="”删除项目“" class="btn_delete"></i></p>');
		setFormDefault(function(){form.render()});
	});
});

function setFormDefault(cb){
	$('input[name=id]').val('');
	$('input[name=way]').val(1);   // 新增
	$('input[name=title]').val(''); // 标题   
	$('input[name=mark]').val('');   // 分数  
	$('#date').val('');        // 时间
	$('input[name=color]').val(''); // 颜色 
	$('select[name=author]').val('');//作者
	$('select[name=num]').val('');     // 期数
	cb();
}

function setInput(data, cb){
	$('input[name=id]').val(data._id);
	$('input[name=way]').val(2);   // 修改
	$('input[name=title]').val(data.title); // 标题   
	$('input[name=mark]').val(data.mark);   // 分数  
	$('#date').val(data.createTime);        // 时间
	$('input[name=color]').val(data.color); // 颜色 
	$('select[name=author]').val(data.author);//作者
	$('select[name=num]').val(data.num);     // 期数
	cb();
}
