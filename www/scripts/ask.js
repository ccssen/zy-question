//返回上一页
$('#goback').click(function(){
	history.go(-1)
})
//返回首页
$('#home').click(function(){
	location.href = 'index.html'
})
//提问
$('form').submit(function(e){
//	阻止默认事件
	e.preventDefault();
	//将用作提交的表单元素的值变异成字符串
	var data = $(this).serialize();
	$.post('/question/ask',data,function(resData){
		$('.modal-body').text(resData.message);
		$('#myModal').modal('show');
	})
})





