function Ajax(url,type,data){
	this.url = url;
	this.type = type;
	this.data = data;
}
Ajax.prototype.getAjax = function(cb){
	var _ = this;
	$.ajax({
		type:_.type,
		url:_.url,
		data:_.data || null,
		success:function(result){
			if(cb && typeof cb == 'function'){
				cb(result);
			}else{
				console.error("ajax callback is not function")
			}
		},
		error:function(err){
			if(cb && typeof cb == 'function'){
				cb(err);
			}else{
				console.error("ajax callback is not function")
			}
		}
	});
}

module.exports = Ajax;