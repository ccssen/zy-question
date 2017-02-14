
//返回上一页
$('#goback').click(function(){
	history.go(-1)
})
//返回首页
$('#home').click(function(){
	location.href = 'index.html'
})

//提交
$('form').submit(function(e){
//	阻止默认事件
	e.preventDefault();
//	比较密码和确认密码是否一致
//这里返回的psw是个数组
	var psw = $('input[type=password]').map(function(){
		return $(this).val();
	})
	if(psw[0]!=psw[1]){
//		输入不一致
	$('.modal-body').text('两次输入的密码不一致');
	$('#myModal').modal('show');
	return;
	}
	
//	var data = new Formdata(this)元素获取表单数据方法
//将用作提交的表单元素的值变异成字符串
	var data = $(this).serialize();
	
	$.post('/user/register',data,function(resData){
//		console.log(resData);
		$('.modal-body').text(resData.message)
	$('#myModal').modal('show').on('hidden.bs.modal', function () {
  	// 执行一些动作...
//	console.log('xiaos')
		
		if(resData.code==3){
			location.href='register.html';
		}
	});
		
	})
})





 