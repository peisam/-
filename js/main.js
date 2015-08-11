var EDU = (function(){
    // 工具函数
    var getCookie = function(){
        var cookie = {};
        var all = document.cookie;
        if(all === ""){
            return cookie;
        }
        var list = all.split(";");
        for(var i=0;i<list.length;i++){
            var item = list[i].trim();
            var p = item.indexOf("=");
            var name = item.substring(0,p);
            name = decodeURIComponent(name);
            var value = item.substring(p+1);
            value = decodeURIComponent(value);
            cookie[name] = value;
        }
        return  cookie;
    }

    var setCookie = function(name,value,daysToLive){
        var cookie = name + "=" + encodeURIComponent(value);
        if(typeof daysToLive === 'number')
            cookie += "; expires=" + (daysToLive*60*60*24);
        document.cookie = cookie;
    }

    var eventUtil = {
        addHandler: function(element,type,handler){
            if(element.addEventListener){
                element.addEventListener(type,handler,false);
            }else
            if(element.attachEvent){
                element.attachEvent("on" + type,handler);
            }else{
                element['on' + type] = handler;
                }
        },
    }
    var encodeFormData = function(data){
        if(!data)return "";
        var pairs = [];
        for(var name in data){
            var value = data[name].toString();
            name = encodeURIComponent(name);
            value = encodeURIComponent(value);
            pairs.push(name + '=' + value);
        }
        return pairs.join("&");
    }

    var getData =function(url,data,callback){
        var request = new XMLHttpRequest();
        request.open("GET",url + "?" + encodeFormData(data),true);
        request.onreadystatechange = function(){
            if(request.readyState == 4 && callback){
                if((request.status >= 200 && request.status <300) || request.status == 304){
                    var type = request.getResponseHeader("Content-Type");
                    if (type === 'application/json') {
                        callback(JSON.parse(request.responseText))
                    }else{
                        callback(request);
                    }
                }else{
                    alert("request was unsuccessful: " + request.status)
                }
            }
        }
        request.send(null);
    }
    // 顶部提示
    var pro = document.querySelector(".g-pro");

        if(getCookie().noMorePro){
            pro.style.display = "none";
        }

        var noMoreProHandler = function(){
            setCookie('noMorePro','true',900);
            pro.style.display = "none";
        }
        var btnNoMore = document.querySelector(".pro-content-right");
        eventUtil.addHandler(btnNoMore,'click',noMoreProHandler);
    // 登录表单部分
    var loginForce = (function(){

        var docLoginForm = document.querySelector(".g-dis-login");
        var form = document.forms.loginForm;
        var btnForce = document.querySelector(".follow-btn");
        var domForce = document.querySelector(".force")
        var btnCloseLogin = document.querySelector(".close-icon");
        var btnlogin = document.querySelector("#login");
        var btnCloseLogin = document.querySelector(".close-icon")
        //打开登录框
        var loginForm = function(){
            if(getCookie().loginSuc){
                forceAPI(forceed);
            }else{
                docLoginForm.style.display = "block";
            }
        }
        //关闭登录框
        var closeLogin = function(){
            docLoginForm.style.display = "none";
        }

        eventUtil.addHandler(domForce,"click",loginForm);
        eventUtil.addHandler(btnCloseLogin,"click",closeLogin); //关闭登录框
        //取得表单数据
        var getDataObject = function(){
            var docUsername = document.querySelector("#account");
            var docPaasword = document.querySelector("#password");
            var username = docUsername.value;
            var password = docPaasword.value;
            var data = {
                    userName: md5(username),
                    password: md5(password)
            }
            return data;
        }
        //登录后的回调函数
        var loginCallback = function(req){
            if(req.responseText){
                setCookie("loginSuc","true",100);
                forceAPI(forceed);
                closeLogin();
            alert("登录成功");
            }
        }
        //登录
        var login = function(req){
            var url = 'http://study.163.com/webDev/login.htm';
            var data = getDataObject();
            getData(url,data,loginCallback)
        }
        eventUtil.addHandler(btnlogin,'click',login);


        // 关注API
        var followNum = document.querySelector(".f0llow-num");

        var forceAPI = function(callback){
            var url = 'http://study.163.com/webDev/attention.htm';
            getData(url,{},callback);
        }
        // 关注
        var forceed = function(request){
            if(request.responseText == '1'){
                btnForce.classList.add("follow-btn-ed");
                btnForce.firstChild.innerHTML = "√ 已关注 ";
                btnForce.lastChild.style.display = "inline-block";
                followNum.innerHTML = "粉丝 46";
                setCookie("followSuc","true",10);
            }else{alert('关注失败')}
        }

        // 取消关注
        var cancelForce = function(){
            forceAPI(cancel);
        }
        var cancel = function(request){
            if(request.responseText == '1'){
                btnForce.classList.remove('follow-btn-ed');
                btnForce.firstChild.innerHTML = "+ 关注";
                btnForce.lastChild.style.display = "none";
                followNum.innerHTML = "粉丝 45";
                setCookie("followSuc","false",10);
            }else{alert('取消关注失败')}
        }

        eventUtil.addHandler(btnForce.lastChild,'click',cancelForce);
        if(getCookie().followSuc!=='false'){
            btnForce.classList.add("follow-btn-ed");
            btnForce.firstChild.innerHTML = "√ 已关注 ";
            btnForce.lastChild.style.display = "inline-block";
            followNum.innerHTML = "粉丝 46";
        }else{
            btnForce.classList.remove('follow-btn-ed');
            btnForce.firstChild.innerHTML = "+ 关注";
            btnForce.lastChild.style.display = "none";
            followNum.innerHTML = "粉丝 45";
        }

        })();

    //图片轮播部分
    var picPlay = (function(){
        var banner = document.querySelector(".g-banner");
        var picList = document.getElementById("list");
        var buttons = document.getElementById("buttons").getElementsByTagName("span");
        var len = 3;
        var index = 1;
        var animated;
        var timerPlay,timerFade;
        //图片切换函数
        var animate = function(offset){
            var desTop = parseInt(picList.style.top) + offset;
            var time = 500;
            var interval =500;
            var speed = offset/(time/interval);
            var go = function(){
                if (( parseInt(picList.style.top) < desTop && speed > 0)||(parseInt(picList.style.top) > desTop && speed < 0) ) {
                    picList.style.top = parseInt(picList.style.top) + speed + "px";
                    setTimeout(go, interval);
                    animated = true;
                }else{
                    picList.style.top = desTop + "px";
                    if (desTop > -420) {
                        picList.style.top = -420*len + "px";
                    }
                    if (desTop < -420*len) {
                        picList.style.top =  "-420px";
                    }
                    animated = false;
                    }

                }
            go();
        }
        //淡入函数
        var fadeinTime = function(){
            if(picList.style.opacity < 1){
                picList.style.opacity = parseFloat(picList.style.opacity) + 0.005
                timerFade = setTimeout(fadeinTime,10);
            }else{
                picList.style.opacity = 1;
                clearTimeout(timerFade);
                }
            }

        //自动播放
        var play = function() {
            timerPlay = setTimeout(function () {
                nextPic();
                play();
            }, 5000);
        }
        play();
        //悬停
        var stop = function(){
            clearTimeout(timerPlay,timerFade);
        }
        banner.onmouseover = stop;
        banner.onmouseout = play;
        var showButton =  function() {
                for (var i = 0; i < buttons.length ; i++) {
                    if( buttons[i].className == 'on'){
                        buttons[i].className = '';
                        break;
                    }
                }
                buttons[index - 1].className = 'on';
            }

        var nextPic = function(){
            if (index == 3) {
                index = 1;
            }else{
                index += 1;
                }
            picList.style.opacity = 0.4;
            animate(-420);
            fadeinTime();
            showButton();
        }

        for (var i = 0; i < buttons.length; i++) {
            buttons[i].onclick = function(){
                if (animated) return;
                var myIndex = parseInt(this.getAttribute('index'));
                var offset = -420 * (myIndex - index);
                picList.style.opacity = 0.4;
                animate(offset);
                fadeinTime();
                index = myIndex;
                showButton();
             }
         };
    })()

    //课程列表
    var courseList = (function(){
        var designButton = document.querySelector(".design");
        var langugeButton = document.querySelector(".languge");
        var first = true;
        designButton.onclick = function(){
            getCourseList(1,10);
            langugeButton.style.backgroundColor = '#fff';
            langugeButton.style.color = "#000";
            this.style.backgroundColor = '#39a030';
            this.style.color = "#fff";
            first = true;
        }

        langugeButton.onclick = function(){
            getCourseList(1,20);
            designButton.style.backgroundColor = '#fff';
            designButton.style.color = "#000";
            this.style.backgroundColor = '#39a030';
            this.style.color = "#fff";
            first = false;
        }

        var data;
        //请求参数生成
        var urlDataCreate = function(pageNo,type){
            data = {
                'pageNo' : pageNo,
                'psize' : 20,
                'type' : type,
            }
            return data;
        }
        var dealCourseList = function(req){
            var listObj = JSON.parse(req.responseText);
            var ulContainer = document.querySelector(".course-list ul");
            var liNodes = [] , liNode;
            for (var i = 0; i < listObj.list.length; i++) {
                var price = listObj.list[i].price ? '￥'+parseFloat(listObj.list[i].price):"免费"
                liNode ='<li class="list-item">'+
                            '<img src=' + listObj.list[i].bigPhotoUrl + ' alt=""/>'+
                            '<div class="item-content">'+
                                '<p class="item-title"><a>'+listObj.list[i].name+'</a></p>'+
                                '<p class="item-category">'+listObj.list[i].categoryName+'</p>'+
                                '<p class="learnerCount">'+listObj.list[i].learnerCount+'</p>'+
                                '<p class="price">'+price+'</p>'+
                            '</div>'+
                        '</li>'
                liNodes.push(liNode);
            }
            var li = liNodes.join(" ");
            ulContainer.innerHTML = li;

        }
        //get方法获取数据
        var getCourseList = function(pageNo,type){
            var data = urlDataCreate(pageNo,type);
            var url = "http://study.163.com/webDev/couresByCategory.htm";
            getData(url,data,dealCourseList);
        }
        designButton.onclick();

        //翻页
        var numButton = document.querySelector(".next  ul");
        numButton.onclick = function(){
            var num = parseInt(event.target.textContent);
            if (first) {
                getCourseList(num,10);
            }else{
                getCourseList(num,20);
            }
            for (var i = 0; i < this.children.length; i++) {
                this.children[i].style.color = '#000'
            };
            event.target.style.color = '#39a030';

        }
    })()
        //最热排行
    var hotList = (function(){
        var hotListCallback = function(req){
            var listObj = JSON.parse(req.responseText);
            console.log(listObj);
            var ulContainer = document.querySelector(".hot-item ul");
            var liNodes = [] , liNode;
            for (var i = 0; i < 10; i++) {
                liNode = '<li>'+
                            '<img src=' + listObj[i].bigPhotoUrl + ' alt=""/>'+
                            '<div class="item-content">'+
                                '<p class="item-title">'+listObj[i].name+'</p>'+
                                '<p class="hotcount">'+listObj[i].learnerCount+'</p>'+
                            '</div>'+
                            '</li>'
                liNodes.push(liNode);
                };
            var li = liNodes.join(" ");
            ulContainer.innerHTML = li;
            }
        var getHotList = function(){
            var url = 'http://study.163.com/webDev/hotcouresByCategory.htm';
            getData(url,{},hotListCallback);
        }
        getHotList();
        })()
    //视频播放
    var domVedio = document.querySelector(".org-movie");
    var domVedioContainer = document.querySelector(".g-dis-vedio");
    var domCloseContainer = document.querySelector(".close-video");
    domVedio.onclick = function(){
        domVedioContainer.style.display = "block";
    }
    domCloseContainer.onclick = function(){
            domVedioContainer.style.display = "none";
        }
    var video = function(){


    }
    var player = document.querySelector(".video"),
        btn = document.getElementById("videobtn"),
        curtime = document.getElementById("curtime"),
        duration = document.getElementById("duration");

    //更新播放时间
    duration.innerHTML = player.duration;

    eventUtil.addHandler(btn,"click",function(event){
        if (player.paused) {
            player.play();
            btn.value = "Paused";
        }else{
            player.pause();
            btn.value = "play";
        }
    })
    //定时更新当前时间
    setInterval(function(){
        curtime.innerHTML = player.currentTime;
    },250)

})();
