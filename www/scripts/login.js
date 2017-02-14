
$('#goback').click(function(){
	history.go(-1)
})
//返回首页
$('#register').click(function(){
	location.href = 'register.html'
})

//提交
$('form').submit(function(e){
//	阻止默认事件
	e.preventDefault();

	
//	var data = new Formdata(this)元素获取表单数据方法
//将用作提交的表单元素的值变异成字符串
	var data = $(this).serialize();
	
	$.post('/user/login',data,function(resData){
//		console.log(resData);
		$('.modal-body').text(resData.message);
//		模态框消失触发事件
		$('#myModal').modal('show').on('hidden.bs.modal', function () {
  	// 执行一些动作...
//	console.log('xiaos')
			if(resData.code==3){
				location.href='index.html';
			}
		});
		
	})
})





