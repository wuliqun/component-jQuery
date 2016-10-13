!function($){
	var template =
		'<div class="m-sld">\
			<div class="img">\
				<a target="_blank" class="slide active">\
					<img width="100%" height="100%"/>\
				</a>\
				<a target="_blank" class="slide">\
					<img width="100%" height="100%"/>\
				</a>\
			</div>\
			<a target="_blank" class="caption">\
			</a>\
			<div class="ctrl">\
			</div>\
		</div>';
	/**
	 * @param options = {
	 *     container:...,
	 *     data:[{src:...,url:...,title:...,description:...,captionUrl],
	 *     //title description captionUrl可选 captionUrl默认为url     
	 *     prevNext:是否需要左右按钮,默认false
	 *     method:轮播方式 支持:'fade'淡出 & 'slip'滑动 & 
	 *     						'none'无,默认淡出
	 *     duration:轮播动画(淡出或滑动)时长,默认500ms
	 *     autoplay:...是否自动轮播,默认true,
	 *     delay:...轮播延迟时间,默认5s,与autoplay=true配合
	 * }
	 */
	function Slide(options){
		this.body = $(template);
		this.imgBox = $('.img',this.body);
		this.links = $('a',this.imgBox);
		this.imgs = $('img',this.imgBox);	
		this.caption = $('.caption',this.body);
		this.ctrl = $('.ctrl',this.body);
		options = $.extend({
			delay:5000,
			duration:500,
			autoplay:!0,
			prevNext:!1,
			method:'fade'
		},options);
		$.extend(this,options);		
	}
	$.extend(Slide.prototype,{
		_init:function(){
			var len = this.data.length,
				html = '<ul><li class="active">1</li>';
			for(var i=2;i<=len;i++){
				html += '<li>'+i+'</li>'
			}
			html += '</ul>';
			//设置控制小圆点
			this.ctrl.html(html);

			this.index = 0;	//当前图片索引
			this.actIndex = 0;//当前active的a
			//初始化链接 & 图片
			this.links.eq(0).attr('href',this.data[0].url);
			this.caption.attr('href',this.data[0].captionUrl || this.data[0].url);
			this.imgs.eq(0).attr({
				src:this.data[0].src,
				alt:this.data[0].alt || ''
			});
			html = '';
			if(this.data[0].title){
				html = '<h3>'+this.data[0].title+'</h3>';
			}
			if(this.data[0].description){
				html += '<p>'+this.data[0].description+'<p>';
			}
			this.caption.html(html);
			if(this.prevNext){//添加prev next图标
				this.prev = $('<a class="prev"></a>');
				this.body.append(this.prev);
				this.next = $('<a class="next"></a>');
				this.body.append(this.next);
			}	
			if(this.method !== 'slip'){
				//淡出方法 只需要一张图片链接
				this.links.eq(1).remove();
				this.link = this.links.eq(0);
				this.img = this.imgs.eq(0);
				this.links = null;
				this.imgs = null;
			}
		},
		show:function(){
			this.container.append(this.body);
			this._init();
			this._initEvents();	
			if(this.method === 'fade'){
				this._fadeIn();
			}
			if(this.autoplay){
				this._play();
			}
		},
		hide:function(){
			this.body.remove();
		},
		slideNext:function(){
			var index = this.index+1;
			if(index >= this.data.length){
				index = 0;
				//标记!!最后一个slideNext依然从右滑出
				this.to = 1;
			}
			this.slide(index);
		},
		slidePrev:function(){
			var index = this.index-1;
			if(index < 0){
				index = this.data.length-1;
				//标记!!第一个slidePrev依然从左滑出
				this.to = 2;
			}
			this.slide(index);
		},
		slide:function(index){
			if(index === this.index) return;
			//可以在外部用on绑定轮播前事件
			$(this).trigger('before.slide',index);
			//设置控制点
			this.ctrls.eq(this.index).removeClass('active');
			this.ctrls.eq(index).addClass('active');
			//设置caption
			var html = '';
			if(this.data[index].title){
				html = '<h3>'+this.data[index].title+'</h3>';
			}
			if(this.data[index].description){
				html += '<p>'+this.data[index].description+'<p>';
			}
			this.caption.html(html);
			this.caption.attr('href',this.data[index].captionUrl || this.data[index].url);
			//根据method不同选择轮播方法
			if(this.method === 'slip'){
				this._slip(index);
			}else if(this.method === 'none'){
				this._in(index);
			}else{
				this._in(index);
				this._fadeIn();
			}
			//可以在外部用on绑定轮播后事件
			$(this).trigger('after.slide',index);
		},
		_in:function(index){
			this.link.attr('href',this.data[index].url);
			this.img.attr({
				src:this.data[index].src,
				alt:this.data[index].alt || ''
			});
			this.index = index;	//当前图片索引
			if(this.method === 'fade'){
				this._fadeIn();
			}
		},
		_slip:function(index){
			var _s = this,
				backIndex = 1 - this.actIndex,
				direction;
			//即将出现的图片链接的index
			_s.links.eq(backIndex).attr('href',_s.data[index].url);
			_s.imgs.eq(backIndex).attr({
				src:_s.data[index].src,
				alt:_s.data[index].alt || ''
			});		
			if(_s.to === 1 || (index > _s.index && _s.to !== 2)){
				_s.to = 0;
				_s.links.eq(backIndex).css('left','100%');
				direction = -1;
			}else{
				_s.to = 0;
				_s.links.eq(backIndex).css('left','-100%');
				direction = 1;
			}
			_s.index = index;
			_s.imgBox.animate({
				left:direction*_s.imgBox.width()
			},_s.duration,function(){
				_s.links.toggleClass('active').css({left:0});
				_s.actIndex = backIndex;
				_s.imgBox.css({left:0});
			});
		},
		_fadeIn:function(){
			this.link.css({opacity:0}).animate({opacity:1},500);
		},
		//轮播
		_play:function(){
			var _s = this;
			_s.timer = setInterval($.proxy(_s,'slideNext'),_s.delay);
			_s.body.on('mouseover',function(){
				clearInterval(_s.timer);
			});
			_s.body.on('mouseout',function(){
				_s.timer = setInterval($.proxy(_s,'slideNext'),_s.delay);
			});
		},
		_initEvents:function(){
			this.ctrls = $('li',this.ctrl);
			var len = this.ctrls.length;
			for(var i=0;i<len;i++){
				this.ctrls.eq(i).click($.proxy(this,'slide',i));
			}
			if(this.prevNext){
				this.prev.click($.proxy(this,'slidePrev'));
				this.next.click($.proxy(this,'slideNext'));
			}
		}
	});
	window.Slide = Slide;

}(jQuery);