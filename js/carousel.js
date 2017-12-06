/**
 * Created by zengxuelu on 2017/12/6.
 */

function Carousel(options) {
  this.carousel = document.querySelector(options.container); // 外层容器
  this.imgBox = this.carousel.children[0];  // 图片盒子
  this.points = this.carousel.children[1].children;
  this.imgBox.appendChild(this.imgBox.children[0].cloneNode(true));
  this.imgBox.insertBefore(this.imgBox.children[this.imgBox.children.length - 2].cloneNode(true), this.imgBox.children[0]);
  this.timer = null;
  this.index = 1;
  this.startX = 0;  // 记录手指触摸屏幕的开始位置
  // 初始化imgBox的位置
  this.imgBox.style.transform = 'translateX(-' + this.carousel.offsetWidth +'px)';
  this.imgBox.style.webkitTransform = 'translateX(-' + this.carousel.offsetWidth +'px)';
  
  this.initEvents(options);
}
Carousel.prototype = {
  constructor: Carousel,
  // 添加过渡
  addTransition: function () {
    this.imgBox.style.transition = 'all .2s';
    this.imgBox.style.webkitTransition = 'all .2s';
  },
  // 移除过渡
  removeTransition: function () {
    this.imgBox.style.transition = 'none';
    this.imgBox.style.webkitTransition = 'none';
  },
  // 设置移动值
  setTranslateX: function (x) {
    this.imgBox.style.transform = 'translateX(' + x + 'px)';
    this.imgBox.style.webkitTransform = 'translateX(' + x + 'px)';
  },
  // 自动轮播
  autoPlay: function (options) {
    var that = this;
    if (options.autoPlay) {
      this.timer = setInterval(function () {
        that.index++;
        // 添加过渡
        that.addTransition();
        // 设置imgBox的移动值
        that.setTranslateX(-that.index * that.carousel.offsetWidth);
      }, options.autoPlayTime);
    }
  },
  // 初始化事件
  initEvents: function (options) {
    var that = this;
    this.autoPlay(options);
    this.imgBox.addEventListener('transitionend', function () {
      that.transitionend();
    });
    this.imgBox.addEventListener('touchstart', function (e) {
      that.touchstart(e);
    });
    this.imgBox.addEventListener('touchmove', function (e) {
      that.touchmove(e);
    });
    this.imgBox.addEventListener('touchend', function (e) {
      that.touchend(e);
      // 结束后重新开启定时器
      that.autoPlay(options);
    });
  },
  transitionend: function () {
    if (this.index >= this.imgBox.children.length - 1) {
      this.index = 1;
    }
    if (this.index <= 0) {
      this.index = this.imgBox.children.length - 2;
    }
    // 移除过渡
    this.removeTransition();
    // 设置imgBox的移动值
    this.setTranslateX(-this.index * this.carousel.offsetWidth);
    for (var i = 0; i < this.points.length; i++) {
      this.points[i].classList.remove('now');
    }
    this.points[this.index - 1].classList.add('now');
  },
  touchstart: function (e) {
    clearInterval(this.timer);
    this.startX = e.touches[0].clientX;
  },
  touchmove: function (e) {
    var moveX = e.touches[0].clientX - this.startX;
    // 移动过程中 移除过渡, 设置imgBox的值
    this.removeTransition();
    this.setTranslateX(-this.index * this.carousel.offsetWidth + moveX);
  },
  touchend: function (e) {
    var moveX = e.changedTouches[0].clientX - this.startX;
    //  限制滑动距离范围, 才允许滑动
    if (Math.abs(moveX) > this.carousel.offsetWidth  / 3 || Math.abs(moveX) > 100) {
      if (moveX > 0) {
        this.index--
      } else {
        this.index++;
      }
    }
    
    // 添加过渡
    this.addTransition();
    // 设置imgBox的移动值
    this.setTranslateX(-this.index * this.carousel.offsetWidth);
  }
}
