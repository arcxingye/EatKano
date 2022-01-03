var isDesktop = navigator['userAgent'].match(/(ipad|iphone|ipod|android|windows phone)/i) ? false : true;
var fontunit = isDesktop ? 20 : ((window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth) / 320) * 10;
document.write('<style type="text/css">' +
    'html,body {font-size:' + (fontunit < 30 ? fontunit : '30') + 'px;}' +
    (isDesktop ? '#welcome,#GameTimeLayer,#GameLayerBG,#GameScoreLayer.SHADE{position: absolute;}' :
        '#welcome,#GameTimeLayer,#GameLayerBG,#GameScoreLayer.SHADE{position:fixed;}@media screen and (orientation:landscape) {#landscape {display: box; display: -webkit-box; display: -moz-box; display: -ms-flexbox;}}') +
    '</style>');
if (isDesktop) document.write('<div id="gameBody">');
var body, blockSize, GameLayer = [],
    GameLayerBG, touchArea = [],
    GameTimeLayer;
var transform, transitionDuration;

function init() {
    showWelcomeLayer();
    body = document.getElementById('gameBody') || document.body;
    body.style.height = window.innerHeight + 'px';
    transform = typeof (body.style.webkitTransform) != 'undefined' ? 'webkitTransform' : (typeof (body.style.msTransform) !=
        'undefined' ? 'msTransform' : 'transform');
    transitionDuration = transform.replace(/ransform/g, 'ransitionDuration');
    GameTimeLayer = document.getElementById('GameTimeLayer');
    GameLayer.push(document.getElementById('GameLayer1'));
    GameLayer[0].children = GameLayer[0].querySelectorAll('div');
    GameLayer.push(document.getElementById('GameLayer2'));
    GameLayer[1].children = GameLayer[1].querySelectorAll('div');
    GameLayerBG = document.getElementById('GameLayerBG');
    if (GameLayerBG.ontouchstart === null) {
        GameLayerBG.ontouchstart = gameTapEvent;
    } else {
        GameLayerBG.onmousedown = gameTapEvent;
    }
    gameInit();
    var username = cookie("username");
    var message = cookie("message");
    if (username){
        document.getElementById("username").value = username;
    }
    if (message){
        document.getElementById("message").value = message;
    }
    window.addEventListener('resize', refreshSize, false);
    var btn = document.getElementById('ready-btn');
    btn.className = 'btn btn-primary btn-lg';
    btn.onclick = function () {
        closeWelcomeLayer();
    }
}

function winOpen() {
    window.open(location.href + '?r=' + Math.random(), 'nWin', 'height=500,width=320,toolbar=no,menubar=no,scrollbars=no');
    var opened = window.open('about:blank', '_self');
    opened.opener = null;
    opened.close();
}
var refreshSizeTime;

function refreshSize() {
    clearTimeout(refreshSizeTime);
    refreshSizeTime = setTimeout(_refreshSize, 200);
}

function _refreshSize() {
    countBlockSize();
    for (var i = 0; i < GameLayer.length; i++) {
        var box = GameLayer[i];
        for (var j = 0; j < box.children.length; j++) {
            var r = box.children[j],
                rstyle = r.style;
            rstyle.left = (j % 4) * blockSize + 'px';
            rstyle.bottom = Math.floor(j / 4) * blockSize + 'px';
            rstyle.width = blockSize + 'px';
            rstyle.height = blockSize + 'px';
        }
    }
    var f, a;
    if (GameLayer[0].y > GameLayer[1].y) {
        f = GameLayer[0];
        a = GameLayer[1];
    } else {
        f = GameLayer[1];
        a = GameLayer[0];
    }
    var y = ((_gameBBListIndex) % 10) * blockSize;
    f.y = y;
    f.style[transform] = 'translate3D(0,' + f.y + 'px,0)';
    a.y = -blockSize * Math.floor(f.children.length / 4) + y;
    a.style[transform] = 'translate3D(0,' + a.y + 'px,0)';
}

function countBlockSize() {
    blockSize = body.offsetWidth / 4;
    body.style.height = window.innerHeight + 'px';
    GameLayerBG.style.height = window.innerHeight + 'px';
    touchArea[0] = window.innerHeight - blockSize * 0;
    touchArea[1] = window.innerHeight - blockSize * 3;
}
var _gameBBList = [],
    _gameBBListIndex = 0,
    _gameOver = false,
    _gameStart = false,
    _gameTime, _gameTimeNum, _gameScore;

function gameInit() {
    createjs.Sound.registerSound({
        src: "./static/music/err.mp3",
        id: "err"
    });
    createjs.Sound.registerSound({
        src: "./static/music/end.mp3",
        id: "end"
    });
    createjs.Sound.registerSound({
        src: "./static/music/tap.mp3",
        id: "tap"
    });
    gameRestart();
}

function gameRestart() {
    _gameBBList = [];
    _gameBBListIndex = 0;
    _gameScore = 0;
    _gameOver = false;
    _gameStart = false;
    _gameTimeNum = 20;
    GameTimeLayer.innerHTML = creatTimeText(_gameTimeNum);
    countBlockSize();
    refreshGameLayer(GameLayer[0]);
    refreshGameLayer(GameLayer[1], 1);
}

function gameStart() {
    _date1 = new Date();
    _gameStart = true;
    _gameTime = setInterval(gameTime, 1000);
}

function gameOver() {
    _gameOver = true;
    clearInterval(_gameTime);
    setTimeout(function () {
        GameLayerBG.className = '';
        showGameScoreLayer();
    }, 1500);
}


function encrypt(text){
	var encrypt = new JSEncrypt();
    encrypt.setPublicKey("MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDTzGwX6FVKc7rDiyF3H+jKpBlRCV4jOiJ4JR33qZPVXx8ahW6brdBF9H1vdHBAyO6AeYBumKIyunXP9xzvs1qJdRNhNoVwHCwGDu7TA+U4M7G9FArDG0Y6k4LbS0Ks9zeRBMiWkW53yQlPshhtOxXCuZZOMLqk1vEvTCODYYqX5QIDAQAB");
    var data = encrypt.encrypt(text);
    return data;
  }

function SubmitResults() {
    var system = "其他操作系统";
    var area = "异世界";
    if (document.getElementById("username").value) {
        if (navigator.appVersion.indexOf("Win") != -1) system = "Windows";
        if (navigator.appVersion.indexOf("Mac") != -1) system = "Macintosh";
        if (navigator.appVersion.indexOf("Linux") != -1) system = "Linux";
        if (navigator.appVersion.indexOf("Android") != -1) system = "Android";
        if (navigator.appVersion.indexOf("like Mac") != -1) system = "iOS";
        if (returnCitySN['cname']) { area = returnCitySN['cname'] };
        var httpRequest = new XMLHttpRequest();
        httpRequest.open('POST', './SubmitResults.php', true);
        httpRequest.setRequestHeader("Content-type", "application/json");
        var name = document.getElementById("username").value;
        var message = document.getElementById("message").value;
		var test="|_|";
        httpRequest.send(encrypt(_gameScore + test + name + test + tj + test + system + test + area + test + message));
    }
}

function gameTime() {
    _gameTimeNum--;
    if (_gameTimeNum <= 0) {
        GameTimeLayer.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;时间到！';
        gameOver();
        GameLayerBG.className += ' flash';
        createjs.Sound.play("end");
    } else {
        GameTimeLayer.innerHTML = creatTimeText(_gameTimeNum);
    }
}

function creatTimeText(n) {
    return '&nbsp;TIME:'+n;
}
var _ttreg = / t{1,2}(\d+)/,
    _clearttClsReg = / t{1,2}\d+| bad/;

function refreshGameLayer(box, loop, offset) {
    var i = Math.floor(Math.random() * 1000) % 4 + (loop ? 0 : 4);
    for (var j = 0; j < box.children.length; j++) {
        var r = box.children[j],
            rstyle = r.style;
        rstyle.left = (j % 4) * blockSize + 'px';
        rstyle.bottom = Math.floor(j / 4) * blockSize + 'px';
        rstyle.width = blockSize + 'px';
        rstyle.height = blockSize + 'px';
        r.className = r.className.replace(_clearttClsReg, '');
        if (i == j) {
            _gameBBList.push({
                cell: i % 4,
                id: r.id
            });
            r.className += ' t' + (Math.floor(Math.random() * 1000) % 5 + 1);
            r.notEmpty = true;
            i = (Math.floor(j / 4) + 1) * 4 + Math.floor(Math.random() * 1000) % 4;
        } else {
            r.notEmpty = false;
        }
    }
    if (loop) {
        box.style.webkitTransitionDuration = '0ms';
        box.style.display = 'none';
        box.y = -blockSize * (Math.floor(box.children.length / 4) + (offset || 0)) * loop;
        setTimeout(function () {
            box.style[transform] = 'translate3D(0,' + box.y + 'px,0)';
            setTimeout(function () {
                box.style.display = 'block';
            }, 100);
        }, 200);
    } else {
        box.y = 0;
        box.style[transform] = 'translate3D(0,' + box.y + 'px,0)';
    }
    box.style[transitionDuration] = '150ms';
}

function gameLayerMoveNextRow() {
    for (var i = 0; i < GameLayer.length; i++) {
        var g = GameLayer[i];
        g.y += blockSize;
        if (g.y > blockSize * (Math.floor(g.children.length / 4))) {
            refreshGameLayer(g, 1, -1);
        } else {
            g.style[transform] = 'translate3D(0,' + g.y + 'px,0)';
        }
    }
}

function gameTapEvent(e) {
    if (_gameOver) {
        return false;
    }
    var tar = e.target;
    var y = e.clientY || e.targetTouches[0].clientY,
        x = (e.clientX || e.targetTouches[0].clientX) - body.offsetLeft,
        p = _gameBBList[_gameBBListIndex];
    if (y > touchArea[0] || y < touchArea[1]) {
        return false;
    }
    if ((p.id == tar.id && tar.notEmpty) || (p.cell == 0 && x < blockSize) || (p.cell == 1 && x > blockSize && x < 2 *
        blockSize) || (p.cell == 2 && x > 2 * blockSize && x < 3 * blockSize) || (p.cell == 3 && x > 3 * blockSize)) {
        if (!_gameStart) {
            gameStart();
        }
        createjs.Sound.play("tap");
        tar = document.getElementById(p.id);
        tar.className = tar.className.replace(_ttreg, ' tt$1');
        _gameBBListIndex++;
        _gameScore++;
        gameLayerMoveNextRow();
    } else if (_gameStart && !tar.notEmpty) {
        createjs.Sound.play("err");
        gameOver();
        tar.className += ' bad';
    }
    return false;
}

function createGameLayer() {
    var html = '<div id="GameLayerBG">';
    for (var i = 1; i <= 2; i++) {
        var id = 'GameLayer' + i;
        html += '<div id="' + id + '" class="GameLayer">';
        for (var j = 0; j < 10; j++) {
            for (var k = 0; k < 4; k++) {
                html += '<div id="' + id + '-' + (k + j * 4) + '" num="' + (k + j * 4) + '" class="block' + (k ? ' bl' : '') +
                    '"></div>';
            }
        }
        html += '</div>';
    }
    html += '</div>';
    html += '<div id="GameTimeLayer"></div>';
    return html;
}

function closeWelcomeLayer() {
    var l = document.getElementById('welcome');
    l.style.display = 'none';
}

function showWelcomeLayer() {
    var l = document.getElementById('welcome');
    l.style.display = 'block';
}

function showGameScoreLayer() {
    var l = document.getElementById('GameScoreLayer');
    var c = document.getElementById(_gameBBList[_gameBBListIndex - 1].id).className.match(_ttreg)[1];
    l.className = l.className.replace(/bgc\d/, 'bgc' + c);
    document.getElementById('GameScoreLayer-text').innerHTML = shareText(_gameScore);
    var score_text='得分&nbsp;&nbsp;';
    score_text+=deviation_time<23000?_gameScore:"<span style='color:red;'>"+_gameScore+"</span>";
    document.getElementById('GameScoreLayer-score').innerHTML = score_text;
    var bast = cookie('bast-score');
    if(deviation_time<23000){
        if (!bast || _gameScore > bast) {
            bast = _gameScore;
            cookie('bast-score', bast, 100);
        }
    }
    document.getElementById('GameScoreLayer-bast').innerHTML = '最佳&nbsp;&nbsp;' + bast;
    l.style.display = 'block';
}

function hideGameScoreLayer() {
    var l = document.getElementById('GameScoreLayer');
    l.style.display = 'none';
}

function replayBtn() {
    gameRestart();
    hideGameScoreLayer();
}

function backBtn() {
    gameRestart();
    hideGameScoreLayer();
    showWelcomeLayer();
}

function shareText(score) {
    var date2 = new Date();
    deviation_time = (date2.getTime() - _date1.getTime())
    if (deviation_time > 23000) {
        return '倒计时多了' + ((deviation_time / 1000) - 20).toFixed(2) + "s";
    }
    SubmitResults();
    if (score <= 49) return '试着好好练一下？';
    if (score <= 99) return 'TCL';
    if (score <= 149) return 'TQL';
    if (score <= 199) return '您';
    return '人？';
}

function toStr(obj) {
    if (typeof obj == 'object') {
        return JSON.stringify(obj);
    } else {
        return obj;
    }
    return '';
}

function cookie(name, value, time) {
    if (name) {
        if (value) {
            if (time) {
                var date = new Date();
                date.setTime(date.getTime() + 864e5 * time), time = date.toGMTString();
            }
            return document.cookie = name + "=" + escape(toStr(value)) + (time ? "; expires=" + time + (arguments[3] ?
                "; domain=" + arguments[3] + (arguments[4] ? "; path=" + arguments[4] + (arguments[5] ? "; secure" : "") : "") :
                "") : ""), !0;
        }
        return value = document.cookie.match("(?:^|;)\\s*" + name.replace(/([-.*+?^${}()|[\]\/\\])/g, "\\$1") + "=([^;]*)"),
            value = value && "string" == typeof value[1] ? unescape(value[1]) : !1, (/^(\{|\[).+\}|\]$/.test(value) ||
                /^[0-9]+$/g.test(value)) && eval("value=" + value), value;
    }
    var data = {};
    value = document.cookie.replace(/\s/g, "").split(";");
    for (var i = 0; value.length > i; i++) name = value[i].split("="), name[1] && (data[name[0]] = unescape(name[1]));
    return data;
}
document.write(createGameLayer());


function show_btn() {
    document.getElementById("btn_group").style.display = "block"
    document.getElementById("setting").style.display = "none"
}
function show_setting() {
    document.getElementById("btn_group").style.display = "none"
    document.getElementById("setting").style.display = "block"
}
function save_cookie() {
    cookie('username', document.getElementById("username").value, 100);
    cookie('message', document.getElementById("message").value, 100);
}
function isnull(val) {
    var str = val.replace(/(^\s*)|(\s*$)/g, '');
    if (str == '' || str == undefined || str == null) {
        return true;
    } else {
        return false;
    }
}
function goRank() {
    var name=document.getElementById("username").value;
    var link='./rank.php';
    if(!isnull(name)){
        link+="?name="+name;
    }
    window.location.href=link;
}
console.log("不修改，好嘛？乱传又有什么用呢？(ˉ▽ˉ；)...")
document.onkeydown = function (e) {
    if (e.keyCode == 123) {
        return false
    }
};
