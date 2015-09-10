
$(document).ready(function(){
	$("button").click(function(){
		// 获取要删除文件的路径
		var content = $(this).prev().attr("href");
		// 选中父级元素
		var li = $(this).parent();

		// 发送请求到server端
	    $.post("/del", content, function(data, status){
			// alert('data is : '+ data + ' status is : '+ status);
			$(this).parent().remove();
			// 判断后端是否删除成功
			if(data == 'ok'){
				li.remove();
			}
		});
	});
});


