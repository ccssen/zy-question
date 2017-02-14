
//返回上一页
$('#goback').click(function(){
	history.go(-1)
})
//返回首页
$('#home').click(function(){
	location.href = 'index.html'
})

//上传头像的请求
$('form').submit(function(e){
	e.preventDefault();
//	获取表单数据
	var data = new FormData(this);
//	var data = $(this).serialize();
	console.log($('this').val())
	console.log(data)
	$.post({
		url:'/user/photo',
		data:data,
		contentType:false,
		processData:false,
		success:function(resData){
			$('.modal-body').text(resData.message);
			$('#myModal').modal('show');
		}
		
	});
})





