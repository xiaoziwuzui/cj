const _apiMap = require('api.js');
import Toast from '../components/vant-weapp/toast/toast.js';
// const baseUrl = 'http://cj.web.con/';
const baseUrl = 'https://cj.520iy.com/';
const Util = function(){
  const self = this;
  self.NET_SUCCESS = 'ok';
  self.NET_MSG_KEY = 'msg';
  self.version     = 1;
  self.token       = false;
  self.api         = _apiMap;
  self.debug       = true;
  self.log         = function(object,index){
    if(self.debug === true){
      if (index){
        console && console.log(object, index);
      }else{
        console && console.log(object);
      }
    }
  };
  self.getRandom = function (max, min) {
    min = arguments[1] || 0;
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  self.containsPoint = function (rect, x, y) {
    return !(x < rect.x ||
      x > rect.x + rect.width ||
      y < rect.y ||
      y > rect.y + rect.height);
  };
  self.captureTouch = function (element) {
    var isTouch = ('ontouchend' in document);
    var touchstart = null;
    var touchmove = null;
    var touchend = null;
    if (isTouch) {
      touchstart = 'touchstart';
      touchmove = 'touchmove';
      touchend = 'touchend';
    } else {
      touchstart = 'mousedown';
      touchmove = 'mousemove';
      touchend = 'mouseup';
    }
    var touch = { x: null, y: null, isPressed: false, event: null },
        body_scrollLeft = document.body.scrollLeft,
        element_scrollLeft = document.documentElement.scrollLeft,
        body_scrollTop = document.body.scrollTop,
        element_scrollTop = document.documentElement.scrollTop,
        offsetLeft = element.offsetLeft,
        offsetTop = element.offsetTop;

    /*传入Event对象*/
    function getPoint(event) {
      /*将当前的触摸点坐标值减去元素的偏移位置，返回触摸点相对于element的坐标值*/
      event = event || window.event;
      var touchEvent = isTouch ? event.changedTouches[0] : event;
      var x = (touchEvent.pageX || touchEvent.clientX + document.body.scrollLeft + document.documentElement.scrollLeft);
      x -= element.offsetLeft;
      var y = (touchEvent.pageY || touchEvent.clientY + document.body.scrollTop + document.documentElement.scrollTop);
      y -= element.offsetTop;
      return {
        x: x,
        y: y
      };
    };

    element.addEventListener(touchstart, function (event) {
      var point = getPoint(event);
      touch.x = point.x;
      touch.y = point.y;
      touch.isPressed = true;
      touch.event = event;
    }, false);

    element.addEventListener(touchend, function (event) {
      touch.isPressed = false;
      touch.x = null;
      touch.y = null;
      touch.event = event;
    }, false);

    element.addEventListener(touchmove, function (event) {
      var point = getPoint(event);
      touch.x = point.x;
      touch.y = point.y;
      touch.event = event;
    }, false);

    return touch;
  };
  /**
   * 设置请求令牌
   * @param token
   */
  self.setToken = function(token){
    self.token = token;
  };
  /**
   * 弹出信息提示
   * 自带的太渣了.
   * @param title
   */
  self.msg = function (title){
    // Toast({
    //   type:'text',
    //   position:'bottom',
    //   message:title,
    //   duration:2000,
    // });
  };
  self.loading = function(title){
    title = title || '加载中...';
    Toast.loading({
      mask: false,
      message: title
    });
  };
  self.closeLoading = function () {
    Toast.clear();
  };
  /**
   * 网络请求封装
   * @param param
   * @returns {boolean}
   */
  self.request = function(param){
    param.type     = param.type || 'GET';
    param.dataType = param.dataType || 'json';
    param.data     = param.data || {};
    param.handle   = param.handle || false;
    param.loading  = param.loading || true;
    param.timeout  = param.timeout || 4000;
    if (typeof (param.url) === 'undefined' || param.url.length === 0) {
      param.callback && param.callback({});
      return true;
    }
    //自动添加令牌和版本号
    if(!param.data.hasOwnProperty('token')){
      if(self.token){
        param.data.token = self.token;
      }
    }
    if(!param.data.hasOwnProperty('version')){
        param.data.version = self.version;
    }
    if (param.loading === true) {
      try{
        self.loading();
      }catch(e){}
    }
    if (param.url.substring(0,4) !== 'http'){
      param.url = baseUrl + param.url;
    }
    wx.request({
      url:      param.url,
      data:     param.data,
      method:   param.type,
      dataType: param.dataType,
      success:  function (response) {
        var result;
        var data;
        if (typeof (response.data) !== 'object'){
          self.msg('服务器异常!');
          param.error && param.error({});
        }else{
          result = response.data;
          if(result.hasOwnProperty('data')){
            data = result.data;
            //主动更新Token
            if (data.hasOwnProperty('token')) {
              self.setToken(data.token);
              wx.setStorageSync('token', data.token);
            }
          }
          if (param.handle) {
            param.callback && param.callback(result);
          } else {
            if (result.status === self.NET_SUCCESS) {
              param.callback && param.callback(result);
            } else {
              self.msg(result[self.NET_MSG_KEY]);
              param.error && param.error(result);
            }
          }
        }
      },
      complete: function () {
        if (param.loading === true) {
          Toast.clear();
        }
      },
      fail: function (result) {
        if (param.handle) {
          param.callback && param.callback(result);
        } else {
          self.msg('服务器异常!');
        }
      }
    });
  }
};
const _Util = new Util();
_Util.setToken(wx.getStorageSync('token') || false);
module.exports = _Util;