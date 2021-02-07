var xtltle = '';
window.shareData = {
    "imgUrl": "https://www.thac.cc/kano/x/02.png",
    "timeLineLink": "https://www.thac.cc/kano/x/",
    "tTitle": "小鹿乃",
    "tContent": "小鹿乃"
};
if (isDesktop) document.write('<div id="gameBody">');
var body, blockSize, GameLayer = [],
    GameLayerBG, touchArea = [],
    GameTimeLayer;
var transform, transitionDuration;

function init(argument) {
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
        document.getElementById('landscape-text').innerHTML = '点我开始玩耍';
        document.getElementById('landscape').onclick = winOpen;
    }
    gameInit();
    window.addEventListener('resize', refreshSize, false);
    var rtnMsg = "true";
    setTimeout(function () {
        if (rtnMsg == 'false') {
            var btn = document.getElementById('ready-btn');
            btn.className = 'btn';
            btn.innerHTML = '您今天已经吃太多鹿乃啦，请明天继续！'
        } else {
            var btn = document.getElementById('ready-btn');
            btn.className = 'btn';
            btn.innerHTML = ' 预备，上！'
            btn.style.backgroundColor = '#F00';
            btn.onclick = function () {
                closeWelcomeLayer();
            }
        }
    }, 500);
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
        src: "img/err.mp3",
        id: "err"
    });
    createjs.Sound.registerSound({
        src: "img/end.mp3",
        id: "end"
    });
    createjs.Sound.registerSound({
        src: "img/tap.mp3",
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
    _gameTimeNum = 2000;
    GameTimeLayer.innerHTML = creatTimeText(_gameTimeNum);
    countBlockSize();
    refreshGameLayer(GameLayer[0]);
    refreshGameLayer(GameLayer[1], 1);
}

function gameStart() {
    _date1 = new Date();
    _gameStart = true;
    _gameTime = setInterval(gameTime, 10);
}

function gameOver() {
    _gameOver = true;
    clearInterval(_gameTime);
    setTimeout(function () {
        GameLayerBG.className = '';
        showGameScoreLayer();
        dd2.innerHTML = dd1.innerHTML;
    }, 1500);
}

function SubmitResults() {
    var date2 = new Date();
    var systeminfo = "其他操作系统";
    var area = "异世界";
    var message = "这个人很懒，什么也没有留下"
    if (document.getElementById("name").value) {
        if (navigator.appVersion.indexOf("Win") != -1) systeminfo = "Windows";
        if (navigator.appVersion.indexOf("Mac") != -1) systeminfo = "Macintosh";
        if (navigator.appVersion.indexOf("Linux") != -1) systeminfo = "Linux";
        if (navigator.appVersion.indexOf("Android") != -1) systeminfo = "Android";
        if (navigator.appVersion.indexOf("like Mac") != -1) systeminfo = "iOS";
        if (returnCitySN['cname']) { area = returnCitySN['cname'] };
        if ((date2.getTime() - _date1.getTime()) <= 21500) {
            var httpRequest = new XMLHttpRequest();
            httpRequest.open('POST', './SubmitResults.php', true);
            httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            var name = document.getElementById("name").value;
            if (document.getElementById("message").value) {
                message = document.getElementById("message").value;
            }
            httpRequest.send('score=' + _gameScore + '&name=' + name + '&t=' + __tj + '&systeminfo=' + systeminfo + '&area=' + area + '&message=' + message);
        } else {
            alert("由于您的设备运行过慢，倒计时无法正常运行,请尝试更换更好的设备或者关掉多余的后台。时间偏差" + ((((date2.getTime() - _date1.getTime())) - 20000) / 1000) + "秒")
        }
    }
}


function gameTime() {
    _gameTimeNum--;
    if (_gameTimeNum <= 0) {
        GameTimeLayer.innerHTML = '&nbsp;&nbsp;&nbsp;&nbsp;时间到！';
        gameOver();
        GameLayerBG.className += ' flash';
        createjs.Sound.play("end");
        if (_gameScore < 300) {
            SubmitResults()
        }
    } else {
        GameTimeLayer.innerHTML = creatTimeText(_gameTimeNum);
    }
}

function creatTimeText(n) {
    var text = (100000 + n + '').substr(-4, 4);
    text = '&nbsp;&nbsp;' + text.substr(0, 2) + "'" + text.substr(2) + "''"
    return text;
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
    document.getElementById('GameScoreLayer-score').innerHTML = '得分&nbsp;&nbsp;' + _gameScore;
    var bast = cookie('bast-score');
    if (!bast || _gameScore > bast) {
        bast = _gameScore;
        cookie('bast-score', bast, 100);
    }
    document.getElementById('GameScoreLayer-bast').innerHTML = '最佳&nbsp;&nbsp;' + bast;
    l.style.display = 'block';
    window.shareData.tTitle = '我吃掉了' + _gameScore + '个小鹿乃，不服来挑战！！！'
}

function hideGameScoreLayer() {
    var l = document.getElementById('GameScoreLayer');
    l.style.display = 'none';
}

function replayBtn() {
    gameRestart();
    hideGameScoreLayer();
}

function gotoRank() {
    window.location.href = './rank.php';
}

function backBtn() {
    gameRestart();
    hideGameScoreLayer();
    showWelcomeLayer();
}
var mebtnopenurl = 'http://mp.weixin.qq.com/s/SW4B8mPNnJPUaDlQj7vzBA';
var gototop = 'http://mp.weixin.qq.com/s/SW4B8mPNnJPUaDlQj7vzBA';

function shareText(score) {
    cookie('score2', score, 100);
    if (score <= 49) return '试着好好练一下？';
    if (score <= 99) return 'TCL';
    if (score <= 149) return 'TQL';
    if (score <= 199) return '您';
    if (score > 199&&score< 330) return '人？';
    if (score > 330) return '建议检查下时间';
}

function shareText1(score) {
    return '看看你能吃到多少个吧(';
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

function share() {
    document.getElementById('share-wx').style.display = 'block';
    document.getElementById('share-wx').onclick = function () {
        this.style.display = 'none';
    };
}
document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() { }, false);