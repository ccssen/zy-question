//处理请求的  类似构造函数
var express = require('express');
//处理post请求的参数到body对象中
var bd = require('body-parser');
//处理缓存cookie到cookie对象
var cokie = require('cookie-parser');
//处理文件写入读取 i/o
var fs = require('fs');
//处理文件上传
var multer = require('multer');

var app = express();

//创建文件存储对象storage
var storage = multer.diskStorage({
	destination:'www/uploads',
	filename:function(req,res,callback){
		var petname = req.cookies.petname;
//		callback回调函数,创建图片名
		callback(null,petname+'.jpg')
	}
})
//创建上传对象
//{storage}是对象  键storage  值为上面的存储..
var uploads = multer({storage})

//配置静态文件夹
app.use(express.static('www'));
app.use(bd.urlencoded({
	extended: true
}));
//解析cookie对象
app.use(cokie());
//注册
var fileName;
app.post('/user/register', function(req, res) {
		console.log(req.body);
		//	先判断是否有user文件夹再创建个文件夹,保存所有注册过的用户
		fs.exists('users', function(ex) {
			if(ex) {
				//			存在写入
				writefile();
			} else {
				//不存在(创建文件夹)
				fs.mkdir('users', function(err) {
					if(err) {
						//创建失败
						res.status(200).json({
							code: 0,
							message: '人品不行,文件夹创建失败'
						})
					} else {
						//					创建成功写入
						writefile();
					}
				})
			}
		});
		//封装一个吧注册信息写入本地的方法
		function writefile() {
			//		判断用户是否已经注册
			//		var file.Name = `users/${req.body.petname}.txt`;
			fileName = 'users/' + req.body.petname + '.txt';
			fs.exists(fileName, function(exi) {
				if(exi) {
					//用户已存在
					res.status(200).json({
						code: 2,
						message: '用户名已存在,请重新注册'
					})
				} else {
					//				在body中加入IP和time属性
					req.body.ip = req.ip;
					req.body.time = new Date();
					//用户为被注册,吧用户信息写入本地
					fs.writeFile(fileName, JSON.stringify(req.body), function(err) {
						if(err) {
							//						写入失败
							res.status(200).json({
								code: 1,
								message: '注册失败,请重新注册'
							})

						} else {

							//						写入成功
							res.status(200).json({
								code: 3,
								message: '注册成功'
							})
						}
					});
				}
			})
		}
	})
	//console.log(fileName)
	//登录
app.post('/user/login', function(req, res) {
	//	console.log(req.body)
	fileName = 'users/' + req.body.petname + '.txt';
	//console.log(fileName)

	//1根据req.petname区users文件夹中匹配文件名
	fs.exists(fileName, function(exi) {
			//匹配到:
			if(exi) {
				fs.readFile(fileName, 'utf-8', function(err, data) {
					var user = JSON.parse(data)
					console.log(user);
					if(err) {
						//					  读取失败:返回系统错误code:1
						res.status(200).json({
							code: 1,
							message: '未知原因登录失败'
						})
					} else {
						//					 读取成功比较req.password ==读出的密码
						console.log(req.body.password)
						if(req.body.password === user.password) {
							//						相等code3 , 
							//设置cookie(把账号petname存储在当前网站内 1有利于下次登录 2保存用户信息)
//							设置cookie时间
							var expires = new Date();
							expires.setMonth(expires.getMonth()+1);
							res.cookie('petname', req.body.petname,{expires});

							res.status(200).json({
								code: 3,
								message: '登录成功'
							})
						} else {
							//						不相等返回code2
							res.status(200).json({
								code: 2,
								message: '密码错误'
							})
						}
					}
				})
			} else {
				//匹配不到:返回用户不存在
				res.status(200).json({
					code: 0,
					message: '用户名不存在,请注册'
				});
			}
		})
		//	   req.petname去user 读取
		//		  读取失败:返回系统错误code:1
		//		 读取成功比较req.password ==读出的密码
		//			不相等返回code2
		//			相等code3
})

//请求处理管线
//提问
app.post('/question/ask', function(req, res) {
	//	判断是否登录(cookie中吧petname床底过来)
	if(!req.cookies.petname) {
		//比如确实登录了但是某些安全软件清除了存储的cookie,更或者登录了自己清除了cookie(或者时间戳到了)
		res.status(200).json({
			code: 0,
			message: '登录一次,请重新登录'
		});
		return;
	}
	//	判断question文件夹是否存在
	fs.exists('question', function(ex) {
			if(ex) {
				//		文件夹存在(写入文件)
					writeFile()
			} else {
				//		文件夹不存在
				fs.mkdir('question', function(err) {
					if(err) {
						//				创建失败
						res.status(200).json({
							code: 1,
							message: '创建文件夹失败'
						})
					} else {
						//				创建成功 写入文件
							writeFile();
					}
				})

			}
		})
		//封装写入问题的方法
	function writeFile() {
//		生成提问问题的文件名
		var date  = new Date();
		var fileName = 'question/'+date.getTime()+".txt";
		//生成存储信息
		req.body.petname = req.cookies.petname;
		req.body.ip = req.ip;
		req.body.time = date;
//		写入文件
		fs.writeFile(fileName, JSON.stringify(req.body), function(err) {
			if(err){
				//写入失败
				res.status(200).json({code: 1,message: '系统问题,问题提交失败'})
			}else{
				//写入成功
				res.status(200).json({code: 2,message: '提交问题成功'})
			}
		})
	}
})
//退出登录
app.get('/user/logout',function(req,res){
	//清除cookie中的petname
	res.clearCookie('petname');
	res.status(200).json({code: 1,message: '已退出登录'})
	
})
//首页数据
app.get('/question/all',function(req,res){
//	返回所有的问题(包含回答)   files文件路径的数组
	fs.readdir('question',function(err,files){
		console.log(files);
		if(err){
//			读取文件失败
			res.status(200).json({code: 0,message: '读取文件失败'})
		}else{
//			读取文件成功
//让最新提问的问题排到前面
			files = files.reverse();
//			创建一个数组容器存放所有的问题对象
			var questions=[];

// 			方法一:for循环遍历文件,同步读取文件内容
//			for (var i = 0; i < files.length; i++) {
//				var file= files[i];
//				var filePath = 'question/'+file;
////				readFile异步读取文件的方法,可可能导致还没读取到res,没事数据就被返回了.解决需要采用递归(一步步按顺序完成)
//
//
////				readFileSync同步读取文件
//				var data = fs.readFileSync(filePath)
////				将字符串转对象,存数组
//				var obj = JSON.parse(data);
//				questions.push(obj);
//				
//			}
//			res.status(200).json(questions)
//			方法二:用递归来遍历文件,异步读取文件
			var i=0;
			function readFile(){
				var file= files[i];
				if(i<files.length){
					var filePath = 'question/'+file;
					fs.readFile(filePath,function(err,data){
						if(!err){
							var obj = JSON.parse(data);
							questions.push(obj);
							i++
							readFile()
						}
					})
				}else{
					res.status(200).json(questions)
//		console.log(questions)
					
				}
			}
			readFile();
		}

	});
})
//回答问题
app.post('/question/answer',function(req,res){
//	验证登录状态
	var petname = req.cookies.petname
	if(!petname){
			res.status(200).json({code: 0,message: '登录异常,请重新登录'})
	}
	
	
//	取出要回答问题的内容
	var question = req.cookies.question
	var filePath = 'question/'+ question +'.txt';
	fs.readFile(filePath,function(err,data){
		if(!err){
			var dataobj = JSON.parse(data);
			//判断有没answers属性(有:之前回答过. 没有:之前没回答过)
			if(!dataobj.answers){
//				创建
				dataobj.answers = [];
			}
//			把answers对象(ip,time,petname,answer) push进去
			req.body.answer = req.body.answer.replace(/</g,'&gt;');
			req.body.answer = req.body.answer.replace(/>/g,'&lt;');
			req.body.petname = petname;
			req.body.ip = req.ip;
			req.body.time = new Date();
			console.log('dataob')
			req.body.question = question;
//			把answers对象(ip,time,petname,answer) push进去
			dataobj.answers.push(req.body);
			//修改过后重新写
			fs.writeFile(filePath,JSON.stringify(dataobj),function(err){
				if(err){
					res.status(200).json({code: 1,message: '写入文件失败'})
				}else{
					res.status(200).json({code: 2,message: '回答问题成功'})
				}
			})
			
		}
	})
})

//上传头像
app.post('/user/photo',uploads.single('photo'),function(req,res){
	console.log(req.body)
	res.status(200).json({code:0,message:'上传头像成功'});
});


//localhost是::1
//ip登录是::ffff:127.0.0.1

//三种缓存
//cookie 
//localstorage
//sessionstorage
//特性 							Cookie 			localStorage 	           sessionStorage
//数据的生命期 	|可设置失效时间，默认是关闭浏览器后失效 	|除非被清除，否则永久保存 			|仅在当前会话下有效，关闭页面或浏览器后被清除
//存放数据大小 						4K左右 				一般为5MB 			|一般为5MB
//与服务器端通信 	|每次都会携带在HTTP头中，    		|仅在客户端（即浏览器）中保存，		|仅在客户端（即浏览器）中保存，不参与和服务器的通信
//			|如果使用cookie保存过多数据会带来性能问题 		|不参与和服务器的通信 
//易用性 	|需要程序员自己封装，源生的Cookie接口不友好 	|源生接口可以接受，亦可再次   		  |源生接口可以接受，亦可再次封装来对Object和Array有更好的支持
//											|封装来对Object和Array有更好的支持
app.listen(3000, function() {

	console.log('爆发吧!!!!!我的麒麟臂!!!!')
})