基于jQuery开发的轮播组件,适应绝大多数环境
DOM结构:
	<div class="m-sld">
		<div class="img">
			<a target="_blank" class="slide active">
				<img width="100%" height="100%"/>
			</a>
			<a target="_blank" class="slide">
				<img width="100%" height="100%"/>
			</a>
		</div>
		<a target="_blank" class="caption">
			<h3></h3>
			<p></p>
		</a>
		<div class="ctrl">
			<ul>
				<li></li>
				<li></li>
				<li></li>
			</ul>
		</div>
		<a class="prev"></a>
		<a class="next"></a>
	</div>
	你可以基于此DOM结构自定义CSS样式
使用方法:
	var slide = new Slide({
		container:$('#container'),//轮播容器
		method:'slip',//轮播方法,'fade'淡出(默认),'slip'滑动,'none'无
		autoplay:true,//是否自动轮播 默认true
		delay:...,//轮播间隔,默认5000ms
		duration:...,//播放动画时间,默认500ms
		prevNext:true,//是否需要向前向后控制按钮,默认false
		data:[{//轮播里面的图片数据,
			src:'banner/banner1.jpg',
			url:'http://open.163.com/',
			alt:'网易公开课',
			title:'...',//caption里面的标题,可选
			description:'...',//caption里面的介绍段落,可选
			captionUrl:'..'//caption上的url,默认与前面url相同
		},{
			src:'banner/banner2.jpg',
			url:'http://study.163.com/',
			alt:'云课堂'
		},{
			src:'banner/banner3.jpg',
			url:'http://www.icourse163.org/',
			alt:'中国大学MOOC'
		}]
	});
	slide.show();

slide对外提供slide(index),slidePrev(),slideNext(),show(),hide()方法
根据方法名字应该就能理解方法作用

也可以在每次播放前后绑定事件
//播放前事件 obj为jQuery包装的组件对象,index为当前图片索引
$(slide).on('before.slide',function(obj,index){})
//播放后事件
$(slide).on('after.slide',function(obj,index){})