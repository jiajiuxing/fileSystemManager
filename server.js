var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var server = http.createServer(function(req, res){
	if(req.url == '/favicon.ico'){
		res.end();
		return;
	}

	// 获取当前路径
	var filePath = path.resolve();

	// 获取请求文件名称
	var fileName = req.url;

	// 获取文件路径
	var pathName = path.join(filePath, fileName);

	var path2 = '';

	function delp(path1){
		if(fs.existsSync(path1)){
			// 判断是否是目录
			if(fs.statSync(path1).isDirectory()){
				// 获取该目录下所有子目录和子文件
				var files = fs.readdirSync(path1);
				// 遍历这些目录和文件，如果是文件直接删除，否则调用自身函数继续遍历下级目录
				files.forEach(function(file){
					path2 = path.join(path1, file);
					if(fs.statSync(path2).isFile()){
						fs.unlinkSync(path2);
					}else{
						delp(path2);
					}
				});
				// 当该目录为空的时候删除
				fs.rmdirSync(path1);
			}else{
				fs.unlinkSync(path1);
			}
			// 如果该目录被成功删除，返回成功
			if(!fs.exists(path1)){
				res.end('ok');
			}
		}
	}

	if(req.url == '/del'){
		// 设置接收数据编码格式为 UTF-8
	    req.setEncoding('utf-8');
	    var postData = ""; 
	    // 数据块接收中
	    req.addListener("data", function (postDataChunk) {
	        postData += postDataChunk;
	    });
	    // 数据接收完毕，执行回调函数
	    var status;
	    req.addListener("end", function () {
	        // console.log('数据接收完毕');
	        var name = postData;
	        // console.log(name);
	        var pathName2 = path.join(filePath, name);
	        delp(pathName2);
	    });
		return;
	}



	// 判断文件或目录是否存在
	fs.exists(pathName, function(exists){
		if(exists){
			// 判断当前是否为目录
			if(fs.statSync(pathName).isDirectory()){
				var str1 = '<script src="http://lib.sinaapp.com/js/jquery/2.0.3/jquery-2.0.3.min.js"></script>';
				str1 +=	'<script src="/public/script/index.js"></script>';
				str1 += '<link rel="stylesheet" href="/public/css/index.css"/><h1>FileManager system directory</h1><ul>';
				// 遍历当前目录下的所有文件
				fs.readdir(pathName, function(err, files){
					res.writeHead(200, {"Content-Type": "text/html;charset=utf-8"});
					if(err){
						console.log("error: " + err);
						return;
					}else{
						files.forEach(function(file){
							filePath1 = path.join(fileName, file).replace(/\\/g, "/");
							console.log(filePath + filePath1);
							var i = 0;
							if(fs.statSync(filePath + filePath1).isFile()){
								str1 += '<li id= "' + i++ +'"> \
										<a style="color:gray" href="' + filePath1 + '">' + file + '</a> \
										<button class="del">删除</button> \
									</li>';
							}else{
								str1 += '<li id= "' + i++ +'"> \
									<a href="' + filePath1 + '">' + file + '</a>  \
									<button class="del">删除</button> \
								</li>';
							}
						});
					}	
					str1 += '</ul>';
					res.end(str1.toString());
				});
			}else{
				res.writeHead(200, {'Content-Type': mime.lookup(path.basename(pathName)) + ';charset=utf-8'});
				fs.readFile(pathName, {flag:"r"}, function(err, data){
					if(err){
						console.log("error: " + err);
					}
					res.end(data);
				});
			}
		}else{
			res.writeHead(404, {"Content-Type": "text/html"});
            res.write('<span style="color:red">"' + pathName + '"</span> was not found on this server.');
            res.end();
		}
	});
	
});

server.listen(8888, function(err){
	if(err){
		console.log("server start failed, error: " + err);
		return;
	}
	console.log("server started, listen port 8888");
});