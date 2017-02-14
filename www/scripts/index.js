
//从本地缓存cookie取出中的petname值
var petname = $.cookie('petname'); 

//点击提问按钮
$('#ask').click(function(){
	petname ? location.href = 'ask.html':location.href='login.html'
	
})
//判断有没有petname绝定user图片样式和行为
if(petname){
	$('#user').find('span').last().text(petname);
}else{
	$('#user').find('span').last().text('登录').parent().removeAttr('data-toggle').click(function(){
		location.href = "login.html"
	});
	
}
//点击退出登录
$('#logout').click(function(){
	$.get('/user/logout',function(resData){
		if(resData.code ==1){
//			重新刷新页面
			location.reload();
		}
	})
})

//给每个问题添加点击事件(不能使用事件绑定因为绑定之前问题还不存在,需要使用事件委托代理)
$('.questions').on('click','.media[data-question]',function(){
//	alert('经济科技'+$(this).attr('data-question'));
	if(petname){
//		吧data-question值存在cookie里
//		sessionStorage.setItem()
//		sessionStorage.getItem()
		$.cookie('question',$(this).data('question'));
		location.href="answer.html"
	}else{
		location.href="login.html"
	}
})


//获取首页数据
$.get('/question/all',function(resData){
	var htmlStr = '';
	for (var i = 0; i < resData.length; i++) {
//		这里采用bootstraplimiande bootstrap多媒体对象(Media object)
		var question = resData[i];
//		这是外层
		htmlStr += '<div class="media" data-question="'+ new Date(question.time).getTime() +'">'
//		内层第一块
		htmlStr += '<div>'
		htmlStr += '<div class = "pull-left"><a>'
		htmlStr += '<img class="media-object" src= "../uploads/'+ question.petname+'.jpg" onerror="defaultimg(this)"/>'
		htmlStr += '</a></div>'
//		内层第二块
		htmlStr += '<div class="media-body">'
		htmlStr += '<h4 class="media-heading">'+question.petname+'</h4>'
		htmlStr +=  question.content
		htmlStr += '<div class = "media-footing">'+ formatDate(new Date(question.time))+'&#x3000;'+formatIP(question.ip) + '</div>'
		htmlStr += '</div>'
		htmlStr += '</div>'
		htmlStr += '</div>'
		if(question.answers){
			for (var j = 0; j < question.answers.length; j++) {
				var answer = question.answers[j];
//				答案外层
				htmlStr += '<div class="media media-child">'
//				内层第一块
				htmlStr +='<div class="media-body">'
				htmlStr +='<h4 class="media-heading">'+answer.petname+'<h4>'
				htmlStr += answer.answer
				htmlStr += '<div class = "media-footing">'+ formatDate(new Date(answer.time))+'&#x3000;'+formatIP(answer.ip) + '</div>'
				htmlStr += '</div>'
//				内层第二块
				htmlStr += '<div class = "media-right"><a>'
				htmlStr += '<img class="media-object" src= "../uploads/'+ answer.petname+'.jpg" onerror="defaultimg(this)"/>'
				htmlStr += '</a></div>'
				htmlStr += '</div>'
			}
		}
		htmlStr+='<hr/>'
	}
	$('.questions').html(htmlStr)
})
//封装一个方法:解析date
function formatDate(time){
	var y = time.getFullYear();
	var M = time.getMonth()+1;
	var d = time.getDate();
	var h = time.getHours();
	var m = time.getMinutes();
	M=M<10?'0'+M:M
	d=d<10?'0'+d:d
	m=m<10?'0'+m:m
	return y + '-' + M +'-'+ d + ' ' + h + ':'+ m;
}
//封装一个方法:解析ip
function formatIP(ip){
	if(ip.startsWith('::1')){
		return 'localhost';
	}else{
		return ip.substr(7);
	}
}
//如果没有上传头像,加载默认图片
function defaultimg(that){
	that.src= "../images/user.png";
}
//点击用户图标按钮
//$('#user').click()





