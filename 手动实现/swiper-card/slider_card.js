
	/**
	* obj: 
	* imgArr 图片数组
	* imgWidth 图片宽度
	* aniTime 动画切换时间
	* intervalTime 停留的时间
	* scale 图片缩放
	* autoplay 是否自动播放
	* gap 图片之间间隔
	*/
	function Swiper(obj) {
		this.imgArr = obj.imgArr || [];
		this.scale = obj.scale || 0.8; // 图片缩放值
		this.gap = obj.gap; // 图片未缩放状态下图片之间的间隔

		// 移动端
		if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
		   this.containerWidth = document.body.clientWidth; // 轮播图盒子宽度
		}else{
			// PC端
		   this.containerWidth = 600; // 轮播图盒子宽度
		}
		this.imgWidth = obj.imgWidth; // 图片宽度
		this.aniTime = obj.aniTime || 500;
		this.intervalTime = this.aniTime + obj.intervalTime || 2000;
		this.nowIndex = 3;
		this.imgDoms = document.getElementsByClassName('swiper-slide' + obj.clsSuffix);
		this.mainDom = document.getElementsByClassName('swiper-main' + obj.clsSuffix)[0];
		this.listDoms = document.getElementsByClassName('swiper-list' + obj.clsSuffix)[0];
		this.activeDom = this.imgDoms[0];
		this.autoplay = obj.autoplay;

		this.listDoms.style.width = `${this.containerWidth}px`;

		this.timer; // 自动播放的定时器
		this.prev = Date.now();

		this.diffLen = (this.containerWidth - this.imgWidth - (this.gap * 2)) / 2;
  		this.clsSuffix = obj.clsSuffix
	}
 
	Swiper.prototype = {
		init: function() {
			this.eventBind();

			let resImgArr;
			if (this.imgArr.length >2) {
				resImgArr = [this.imgArr[this.imgArr.length-2], this.imgArr[this.imgArr.length-1], ...this.imgArr, this.imgArr[0], this.imgArr[1]];
				this.mainDom.style.left = `${-(2 * this.imgWidth + this.gap - this.diffLen)}px`;
				this.mainDom.style.width = `${(this.imgArr.length+2) * (this.imgWidth + (this.gap / 2))}px`;
			} else {
				this.nowIndex = 0;
				resImgArr = [...this.imgArr];
			}
			let str = '';
			resImgArr.forEach((item, index) => {
				str += `<a href="${resImgArr[index].url}"><img class="swiper-slide${this.clsSuffix}" style="width: ${this.imgWidth}px;" src="${resImgArr[index].imgPath}" /></a>`;
			});
			this.mainDom.innerHTML = str;
			this.setScale();
			if (this.autoplay) {
				this.timer = setInterval(this.nextSlider.bind(this, this.aniTime), this.intervalTime);
			}
		},
		setScale: function() {
			// 堆叠式
			if (this.gap < 0) {

				for (let i = 0; i < this.imgDoms.length; i++) {
					if (this.imgArr.length ===2) {
						this.imgDoms[0].style.left = `${(this.containerWidth/4) - (this.imgWidth/2)}px`;
						this.imgDoms[1].style.left = `${(this.containerWidth/4)*3 - (this.imgWidth/2)}px`;
					} else if (this.imgArr.length ===1) {
						this.imgDoms[i].style.left = `${(this.containerWidth/2) - (this.imgWidth/2)}px`;
					} else {
						this.imgDoms[i].style.left = `${(i - 1) * (this.imgWidth + this.gap)}px`;
					}


					if (i === this.nowIndex) {
						this.imgDoms[i].style.transform = 'scale(1)';
						this.imgDoms[i].style.zIndex = '1001';
					} else if (i < this.nowIndex) {
						this.imgDoms[i].style.transform = `scale(${1 - ((this.nowIndex - i) * 0.2)})`;
						this.imgDoms[i].style.zIndex = 1000 - ((this.nowIndex - i));
					} else if (i > this.nowIndex) {
						this.imgDoms[i].style.transform = `scale(${1 - ((i - this.nowIndex) * 0.2)})`;
						this.imgDoms[i].style.zIndex = 1000 - (i - this.nowIndex);
					}
				}
			} else {
			// 卡片式
				for (let i = 0; i < this.imgDoms.length; i++) {
					if (this.imgArr.length ===2) {
						this.imgDoms[0].style.left = `${(this.containerWidth/4) - (this.imgWidth/2)}px`;
						this.imgDoms[1].style.left = `${(this.containerWidth/4)*3 - (this.imgWidth/2)}px`;
					} else if (this.imgArr.length ===1) {
						this.imgDoms[i].style.left = `${(this.containerWidth/2) - (this.imgWidth/2)}px`;
					} else {
						this.imgDoms[i].style.left = `${(i - 1) * (this.imgWidth + this.gap)}px`;
					}
					if (i === this.nowIndex) {
						this.imgDoms[i].style.transform = 'scale(1)';
					} else {
						this.imgDoms[i].style.transform = `scale(${this.scale})`;
					}
				}
			}
		},
		prevSlider: function(aniTime) {
			if (this.imgArr.length ===2) {
				this.nowIndex = this.nowIndex ? 0 : 1;
				this.setScale()
			} else if (this.imgArr.length ===1) {
				return;
			} else {
				this.nowIndex--;
				this.mainDom.style.transition = `left ${aniTime/1000}s`
				this.mainDom.style.left = `${parseInt(this.mainDom.style.left)+(this.gap + this.imgWidth)}px`;
				if (this.nowIndex === 1) {
					this.setScale()
					setTimeout(function() {
						this.nowIndex = (this.imgArr.length+1);
						this.setScale()
						this.mainDom.style.transitionProperty = 'none';
						this.mainDom.style.left = `${-(parseInt(this.imgDoms[this.nowIndex].style.left) - this.diffLen - this.gap)}px`;
					}.bind(this), aniTime)
				} else {
					this.setScale()
				}
			}
		},
		nextSlider: function(aniTime) {
			if (this.imgArr.length ===2) {
				this.nowIndex = this.nowIndex ? 0 : 1;
				this.setScale()
			} else if (this.imgArr.length ===1) {
				return;
			} else {
				if (this.nowIndex >=2) {	
					this.mainDom.style.transition = `left ${aniTime/1000}s`
					this.mainDom.style.left = `${parseInt(this.mainDom.style.left)-(this.gap + this.imgWidth)}px`;
					// this.mainDom.style.left = `${this.gap + this.imgWidth}px`;
				}
				if (this.nowIndex === (this.imgArr.length+1)) {
					this.nowIndex = (this.imgArr.length+2);
					this.setScale()
					setTimeout(function() {
						this.nowIndex = 2;
						this.setScale()
						this.mainDom.style.transitionProperty = 'none';
						this.mainDom.style.left = `${-(this.imgWidth - this.diffLen)}px`;
					}.bind(this), aniTime)
				} else {
					this.nowIndex++;
					this.setScale()
				}
			}
		},
		eventBind: function() {	
			let that = this;

			document.getElementById('next' + this.clsSuffix).onmouseover = function () {
				clearInterval(that.timer);
			}
			document.getElementById('next' + this.clsSuffix).onmouseout = function () {
				that.timer = setInterval(that.nextSlider.bind(that, that.aniTime), that.intervalTime);
			}
			document.getElementById('next' + this.clsSuffix).onclick = function () {
				that.throttle(that.nextSlider, 300, 300);
			}


			document.getElementById('prev' + this.clsSuffix).onmouseover = function () {
				clearInterval(that.timer);
			}
			document.getElementById('prev' + this.clsSuffix).onmouseout = function () {
				that.timer = setInterval(that.nextSlider.bind(that, that.aniTime), that.intervalTime);
			}
			document.getElementById('prev' + this.clsSuffix).onclick = function() {
				that.throttle(that.prevSlider, 300, 300);
			}

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
					that.mainDom.style.transition = `left ${that.aniTime / 1000}s`
				}
				let angle = that.angle({ X: that.startX, Y: that.startY }, { X: that.endX, Y: that.endY });
				if (Math.abs(angle) > 30) return;
			    if (that.endX > that.startX){ // 右滑
			    	that.prevSlider(that.aniTime);
			    } else { // 左滑
			    	that.nextSlider(that.aniTime);
			    }
				that.timer = setInterval(that.nextSlider.bind(that, that.aniTime), that.intervalTime);
				
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