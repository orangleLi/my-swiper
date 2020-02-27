
	/**
	 * obj: 
	 * imgArr 图片数组
	 * aniTIme  动画执行的时间
	 * intervalTime  图片停留的时间
	 * autoplay 是否自动播放
	 */
	function Swiper(obj) {
		this.imgArr = obj.imgArr || [];
		this.retImgArr = [this.imgArr[this.imgArr.length-1], ...this.imgArr, this.imgArr[0]];
		this.aniTIme = obj.aniTIme || 1500;
		this.intervalTime = obj.intervalTime + this.aniTIme || 2500;
		this.nowIndex = 0;

		this.swiperListDom = document.getElementsByClassName('swiper-list')[0];

		this.swiperSpotDom;
		this.leftBtn;
		this.rightBtn;
		this.mainDom;

		this.moveWidth = this.swiperListDom.offsetWidth;
		this.timer = null;

		this.prev = Date.now();

		this.autoplay = obj.autoplay;

	}
	Swiper.prototype = {
		init: function() {
			this.initDom();

			// 轮播单张图片li
			let li = '';
			for (let i = 0; i < this.retImgArr.length; i++) {
				li += `<li style="left: ${i * this.moveWidth}px;width: ${this.moveWidth}px" class="swiper-item"><a href="${this.retImgArr[i].url}"><img src="${this.retImgArr[i].imgPath}" alt=""></a></li>`;
			}
			this.mainDom.innerHTML = li;

			// 小圆点li
			let spotLi = '';
			for (let i = 0; i < this.imgArr.length; i++) {
				if (i === 0) {
					spotLi += `<li class="spot-item" style="background-color: #ff5c1f;" index=${i}></li>`;
				} else {
					spotLi += `<li class="spot-item" index=${i}></li>`;
				}
			}
			this.swiperSpotDom.innerHTML = spotLi;

			// if (this.autoplay) {
			// 	this.timer = setInterval(this.nextSlider.bind(this, this.aniTIme), this.intervalTime);
			// }

			// 上一张，下一张，小圆点绑定点击事件
			this.eventBind()

		},
		initDom() {
			// 轮播图片dom容器
			this.mainDom = document.createElement('ul');
			this.mainDom.className = 'swiper-main';
			this.mainDom.style.width = `${this.moveWidth * (imgArr.length + 2)}px`;
			this.mainDom.style.left = `${-this.moveWidth}px`;
			this.swiperListDom.appendChild(this.mainDom)

			// 小圆点ul容器
			this.swiperSpotDom = document.createElement('ul');
			this.swiperSpotDom.className = 'swiper-spot';
			this.swiperListDom.appendChild(this.swiperSpotDom)

			// 上一张按钮
			this.leftBtn = document.createElement('img');
			this.leftBtn.className = 'leftBtn';
			this.leftBtn.src = '../left.png';
			this.swiperListDom.appendChild(this.leftBtn)

			// 下一张按钮
			this.rightBtn = document.createElement('img');
			this.rightBtn.className = 'rightBtn';
			this.rightBtn.src = '../right.png';
			if (this.imgArr.length===1) {
				this.leftBtn.style.display = 'none';
				this.rightBtn.style.display = 'none';
			}
			this.swiperListDom.appendChild(this.rightBtn)

		},
		prevSlider(aniTIme) {
			let that = this;
			if (this.imgArr.length===1) return;
			this.mainDom.style.transition = `left ${aniTIme / 1000}s`
			this.mainDom.style.left = `${parseInt(this.mainDom.style.left) + this.moveWidth}px`;
			if (this.nowIndex === 0) {
				that.nowIndex = (that.imgArr.length-1);
				that.setActiveSpot();
				setTimeout(function() {					
					that.mainDom.style.transitionProperty = 'none';
					that.mainDom.style.left = `${-that.imgArr.length * that.moveWidth}px`;
				}, aniTIme)
			} else {
				this.nowIndex--;
				this.setActiveSpot();
			}
		},
		nextSlider(aniTIme) {
			let that = this;
			if (this.imgArr.length===1) return;
			this.nowIndex++;
			this.mainDom.style.transition = `left ${aniTIme / 1000}s`
			this.mainDom.style.left = `${parseInt(this.mainDom.style.left) - this.moveWidth}px`;
			if (this.nowIndex === (this.imgArr.length)) {
				that.nowIndex = 0;
				that.setActiveSpot();
				setTimeout(function() {
					that.mainDom.style.transitionProperty = 'none';
					that.mainDom.style.left = `${-that.moveWidth}px`;
				}, aniTIme)
			} else {
				this.setActiveSpot();
			}
		},
		setActiveSpot: function() {
			for (let i = 0; i < this.swiperSpotDom.childElementCount; i++) {				
				if (i === Math.abs(this.nowIndex)) {
					document.getElementsByClassName('spot-item')[i].style.backgroundColor = '#ff5c1f'
				} else {
					document.getElementsByClassName('spot-item')[i].style.backgroundColor = '#ccc'
				}
			}
		},
		eventBind() {
			let that = this;
			// 上一张事件绑定
			this.leftBtn.addEventListener('mouseover', function() {
				clearInterval(that.timer);
			})
			this.leftBtn.addEventListener('mouseout', function() {
				that.timer = setInterval(that.nextSlider.bind(that, that.aniTIme), that.intervalTime);
			})
			this.leftBtn.addEventListener('click', function() {
				that.throttle(that.prevSlider, 300, 300);
			})


			// 下一张事件绑定
			this.rightBtn.addEventListener('mouseover', function() {
				clearInterval(that.timer);
			})
			this.rightBtn.addEventListener('mouseout', function() {
				that.timer = setInterval(that.nextSlider.bind(that, that.aniTIme), that.intervalTime);
			})
			this.rightBtn.addEventListener('click', function() {
				that.throttle(that.nextSlider, 300, 300);
			})


			// 小圆点事件绑定
			this.swiperSpotDom.addEventListener('mouseover', function() {
				clearInterval(that.timer);
			})
			this.swiperSpotDom.addEventListener('mouseout', function() {
				that.timer = setInterval(that.nextSlider.bind(that, that.aniTIme), that.intervalTime);
			})
			this.swiperSpotDom.addEventListener('click', function(e) {
				e = e || window.event; //这一行及下一行是为兼容IE8及以下版本
			　　var target = e.target || e.srcElement;
			　　if (target.tagName.toLowerCase() === "li") {
			　　　　 var ret = this.querySelectorAll("li");
			　　　　 let index = Array.prototype.indexOf.call(ret, target);
					that.nowIndex = index;
					that.setActiveSpot();
					that.mainDom.style.transition = `left .8s`
					that.mainDom.style.left = `${-(that.nowIndex+1) * that.moveWidth}px`;
			　　}
			})

			this.mainDom.addEventListener('touchstart', function(e) {
				clearInterval(that.timer);
				that.startX = e.changedTouches[0].clientX;
				that.startY = e.changedTouches[0].clientY;
			})
			this.mainDom.addEventListener('touchmove', function(e) {
				clearInterval(that.timer);
				that.endX = e.changedTouches[0].clientX;
				that.endY = e.changedTouches[0].clientY;
			})
			this.mainDom.addEventListener('touchend', function(e) {
				if (!that.mainDom.style.transition) {
					that.mainDom.style.transition = `left ${that.aniTIme / 1000}s`
				}
				let angle = that.angle({ X: that.startX, Y: that.startY }, { X: that.endX, Y: that.endY });
				if (Math.abs(angle) > 30) return;
			    if (that.endX > that.startX){ // 右滑
			    	that.prevSlider();
			    } else { // 左滑
			    	that.nextSlider();
			    }
				that.timer = setInterval(that.nextSlider.bind(that, that.aniTIme), that.intervalTime);
				
			})
		},
		// 节流：时间戳版
		throttle(handle, delay, val) {
            var now = Date.now();
            if (now - this.prev >= delay) {
                handle.call(this, val);
                this.prev = Date.now();
            }
		},
		/**
		* 计算滑动角度
		* @param {Object} start 起点坐标
		* @param {Object} end 终点坐标
		*/
		angle: function (start, end) {
		    var _X = end.X - start.X,
		      _Y = end.Y - start.Y
		    //返回角度 /Math.atan()返回数字的反正切值
		    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
		}
	}