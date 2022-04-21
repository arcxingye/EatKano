const MODE_NORMAL = 1, MODE_ENDLESS = 2, MODE_PRACTICE = 3;

(function(w) {
    const DEFAULT_I18N_RESOURCE = 'en';

    function getJsonI18N() {
        let res;
        let lang = navigator.language.substring(0, 2);

        function ajax(name, error) {
            $.ajax({
                url: `./static/i18n/${name}.json`,
                dataType: 'json',
                method: 'GET',
                async: false,
                success: data => res = data,
                error: error
            });
        }

        ajax(lang, () => {
            ajax(DEFAULT_I18N_RESOURCE, () => {});
        })

        return res;
    }

    const I18N = getJsonI18N()

    $('[data-i18n]').each(function() {
        const content = I18N[this.dataset.i18n];
        $(this).text(content);
    });

    $('[data-placeholder-i18n]').each(function() {
        $(this).attr('placeholder', I18N[this.dataset.placeholderI18n]);
    });

    $('html').attr('lang', I18N['lang']);

    let isDesktop = !navigator['userAgent'].match(/(ipad|iphone|ipod|android|windows phone)/i);
    let fontunit = isDesktop ? 20 : ((window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth) / 320) * 10;
    document.write('<style type="text/css">' +
        'html,body {font-size:' + (fontunit < 30 ? fontunit : '30') + 'px;}' +
        (isDesktop ? '#welcome,#GameTimeLayer,#GameLayerBG,#GameScoreLayer.SHADE{position: absolute;}' :
            '#welcome,#GameTimeLayer,#GameLayerBG,#GameScoreLayer.SHADE{position:fixed;}@media screen and (orientation:landscape) {#landscape {display: box; display: -webkit-box; display: -moz-box; display: -ms-flexbox;}}') +
        '</style>');
    let map = {'d': 1, 'f': 2, 'j': 3, 'k': 4};
    if (isDesktop) {
        document.write('<div id="gameBody">');
        document.onkeydown = function (e) {
            let key = e.key.toLowerCase();
            if (Object.keys(map).indexOf(key) !== -1) {
                click(map[key])
            }
        }
    }

    let body, blockSize, GameLayer = [],
        GameLayerBG, touchArea = [],
        GameTimeLayer;
    let transform, transitionDuration, welcomeLayerClosed;

    let mode = getMode();

    let soundMode = getSoundMode();

    w.init = function() {
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
        initSetting();
        window.addEventListener('resize', refreshSize, false);
    }

    function getMode() {
        //有cookie优先返回cookie记录的，没有再返回normal
        return cookie('gameMode') ? parseInt(cookie('gameMode')) : MODE_NORMAL;
    }

    function getSoundMode() {
        // 默认为 on
        return cookie('soundMode') ? cookie('soundMode') : 'on';
    }

    w.changeSoundMode = function() {
        if (soundMode === 'on') {
            soundMode = 'off';
            $('#sound').text(I18N['sound-off']);
        } else {
            soundMode = 'on';
            $('#sound').text(I18N['sound-on']);
        }
        cookie('soundMode', soundMode);
    }

    function modeToString(m) {
        return m === MODE_NORMAL ? I18N['normal'] : (m === MODE_ENDLESS ? I18N['endless'] : I18N['practice']);
    }

    w.changeMode = function(m) {
        mode = m;
        cookie('gameMode', m);
        $('#mode').text(modeToString(m));
    }

    w.readyBtn = function() {
        closeWelcomeLayer();
        updatePanel();
    }

    w.winOpen = function() {
        window.open(location.href + '?r=' + Math.random(), 'nWin', 'height=500,width=320,toolbar=no,menubar=no,scrollbars=no');
        let opened = window.open('about:blank', '_self');
        opened.opener = null;
        opened.close();
    }

    let refreshSizeTime;

    function refreshSize() {
        clearTimeout(refreshSizeTime);
        refreshSizeTime = setTimeout(_refreshSize, 200);
    }

    function _refreshSize() {
        countBlockSize();
        for (let i = 0; i < GameLayer.length; i++) {
            let box = GameLayer[i];
            for (let j = 0; j < box.children.length; j++) {
                let r = box.children[j],
                    rstyle = r.style;
                rstyle.left = (j % 4) * blockSize + 'px';
                rstyle.bottom = Math.floor(j / 4) * blockSize + 'px';
                rstyle.width = blockSize + 'px';
                rstyle.height = blockSize + 'px';
            }
        }
        let f, a;
        if (GameLayer[0].y > GameLayer[1].y) {
            f = GameLayer[0];
            a = GameLayer[1];
        } else {
            f = GameLayer[1];
            a = GameLayer[0];
        }
        let y = ((_gameBBListIndex) % 10) * blockSize;
        f.y = y;
        f.style[transform] = 'translate3D(0,' + f.y + 'px,0)';
        a.y = -blockSize * Math.floor(f.children.length / 4) + y;
        a.style[transform] = 'translate3D(0,' + a.y + 'px,0)';
    }

    function countBlockSize() {
        blockSize = body.offsetWidth / 4;
        body.style.height = window.innerHeight + 'px';
        GameLayerBG.style.height = window.innerHeight + 'px';
        touchArea[0] = window.innerHeight;
        touchArea[1] = window.innerHeight - blockSize * 3;
    }

    let _gameBBList = [],
        _gameBBListIndex = 0,
        _gameOver = false,
        _gameStart = false,
        _gameSettingNum=20,
        _gameTime, _gameTimeNum, _gameScore, _date1, deviationTime;

    let _gameStartTime, _gameStartDatetime;

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
        _gameTimeNum = _gameSettingNum;
        _gameStartTime = 0;
        countBlockSize();
        refreshGameLayer(GameLayer[0]);
        refreshGameLayer(GameLayer[1], 1);
        updatePanel();
    }

    function gameStart() {
        _date1 = new Date();
        _gameStartDatetime = _date1.getTime();
        _gameStart = true;

        _gameTime = setInterval(timer, 1000);
    }

    function getCPS() {
        let cps = _gameScore / ((new Date().getTime() - _gameStartDatetime) / 1000);
        if (isNaN(cps) || cps === Infinity || _gameStartTime < 2) {
            cps = 0;
        }
        return cps;
    }

    function timer() {
        _gameTimeNum--;
        _gameStartTime++;
        if (mode === MODE_NORMAL && _gameTimeNum <= 0) {
            GameTimeLayer.innerHTML = I18N['time-up'] + '!';
            gameOver();
            GameLayerBG.className += ' flash';
            if (soundMode === 'on') {
                createjs.Sound.play("end");
            }
        }
        updatePanel();
    }

    function updatePanel() {
        if (mode === MODE_NORMAL) {
            if (!_gameOver) {
                GameTimeLayer.innerHTML = createTimeText(_gameTimeNum);
            }
        } else if (mode === MODE_ENDLESS) {
            let cps = getCPS();
            let text = (cps === 0 ? I18N['calculating'] : cps.toFixed(2));
            GameTimeLayer.innerHTML = `CPS:${text}`;
        } else {
            GameTimeLayer.innerHTML = `SCORE:${_gameScore}`;
        }
    }
    //使重试按钮获得焦点
    function foucusOnReplay(){
        $('#replay').focus()
    }

    function gameOver() {
        _gameOver = true;
        clearInterval(_gameTime);
        let cps = getCPS();
        updatePanel();
        setTimeout(function () {
            GameLayerBG.className = '';
            showGameScoreLayer(cps);
            foucusOnReplay();
        }, 1500);
    }


    function encrypt(text) {
        let encrypt = new JSEncrypt();
        encrypt.setPublicKey("MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDTzGwX6FVKc7rDiyF3H+jKpBlRCV4jOiJ4JR33qZPVXx8ahW6brdBF9H1vdHBAyO6AeYBumKIyunXP9xzvs1qJdRNhNoVwHCwGDu7TA+U4M7G9FArDG0Y6k4LbS0Ks9zeRBMiWkW53yQlPshhtOxXCuZZOMLqk1vEvTCODYYqX5QIDAQAB");
        return encrypt.encrypt(text);
    }

    function SubmitResults() {
        let system = "其他操作系统";
        let area = "异世界";
        if ($("#username").val() && _gameSettingNum === 20) {
            const systems = [
                ['Win', 'Windows'],
                ['like Mac', 'iOS'],
                ['Mac', 'Macintosh'],
                ['Android', 'Android'],
                ['Linux', 'Linux'],
            ];

            for (let sys of systems) {
                if (navigator.appVersion.indexOf(sys[0]) !== -1) {
                    system = sys[1];
                    break;
                }
            }

            if (returnCitySN && returnCitySN['cname']) {
                area = returnCitySN['cname']
            }

            let httpRequest = new XMLHttpRequest();
            httpRequest.open('POST', './SubmitResults.php', true);
            httpRequest.setRequestHeader("Content-type", "application/json");
            let name = $("#username").val();
            let message = $("#message").val();
            let test = "|_|";
            httpRequest.send(encrypt(_gameScore + test + name + test + tj + test + system + test + area + test + message));
        }
    }

    function createTimeText(n) {
        return 'TIME:' + Math.ceil(n);
    }

    let _ttreg = / t{1,2}(\d+)/,
        _clearttClsReg = / t{1,2}\d+| bad/;

    function refreshGameLayer(box, loop, offset) {
        let i = Math.floor(Math.random() * 1000) % 4 + (loop ? 0 : 4);
        for (let j = 0; j < box.children.length; j++) {
            let r = box.children[j], rstyle = r.style;
            rstyle.left = (j % 4) * blockSize + 'px';
            rstyle.bottom = Math.floor(j / 4) * blockSize + 'px';
            rstyle.width = blockSize + 'px';
            rstyle.height = blockSize + 'px';
            r.className = r.className.replace(_clearttClsReg, '');
            if (i === j) {
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
        for (let i = 0; i < GameLayer.length; i++) {
            let g = GameLayer[i];
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
        let tar = e.target;
        let y = e.clientY || e.targetTouches[0].clientY,
            x = (e.clientX || e.targetTouches[0].clientX) - body.offsetLeft,
            p = _gameBBList[_gameBBListIndex];
        if (y > touchArea[0] || y < touchArea[1]) {
            return false;
        }
        if ((p.id === tar.id && tar.notEmpty) || (p.cell === 0 && x < blockSize) || (p.cell === 1 && x > blockSize && x < 2 *
            blockSize) || (p.cell === 2 && x > 2 * blockSize && x < 3 * blockSize) || (p.cell === 3 && x > 3 * blockSize)) {
            if (!_gameStart) {
                gameStart();
            }
            if (soundMode === 'on') {
                createjs.Sound.play("tap");
            }
            tar = document.getElementById(p.id);
            tar.className = tar.className.replace(_ttreg, ' tt$1');
            _gameBBListIndex++;
            _gameScore++;

            updatePanel();

            gameLayerMoveNextRow();
        } else if (_gameStart && !tar.notEmpty) {
            if (soundMode === 'on') {
                createjs.Sound.play("err");
            }
            tar.classList.add('bad');
            if (mode === MODE_PRACTICE) {
                setTimeout(() => {
                    tar.classList.remove('bad');
                }, 500);
            } else {
                gameOver();
            }
        }
        return false;
    }

    function createGameLayer() {
        let html = '<div id="GameLayerBG">';
        for (let i = 1; i <= 2; i++) {
            let id = 'GameLayer' + i;
            html += '<div id="' + id + '" class="GameLayer">';
            for (let j = 0; j < 10; j++) {
                for (let k = 0; k < 4; k++) {
                    html += '<div id="' + id + '-' + (k + j * 4) + '" num="' + (k + j * 4) + '" class="block' + (k ? ' bl' : '') +
                        '"></div>';
                }
            }
            html += '</div>';
        }
        html += '</div>';
        html += '<div id="GameTimeLayer" class="text-center"></div>';
        return html;
    }

    function closeWelcomeLayer() {
        welcomeLayerClosed = true;
        $('#welcome').css('display', 'none');
        updatePanel();
    }

    function showWelcomeLayer() {
        welcomeLayerClosed = false;
        $('#mode').text(modeToString(mode));
        $('#welcome').css('display', 'block');
    }

    function getBestScore(score) {
        // 练习模式不会进入算分界面
        let cookieName = (mode === MODE_NORMAL ? 'bast-score' : 'endless-best-score');
        let best = cookie(cookieName) ? Math.max(parseFloat(cookie(cookieName)), score) : score;
        cookie(cookieName, best.toFixed(2), 100);
        return best;
    }

    function scoreToString(score) {
        return mode === MODE_ENDLESS ? score.toFixed(2) : score.toString();
    }

    function legalDeviationTime() {
        return deviationTime < (_gameSettingNum + 3) * 1000;
    }

    function showGameScoreLayer(cps) {
        let l = $('#GameScoreLayer');
        let c = $(`#${_gameBBList[_gameBBListIndex - 1].id}`).attr('class').match(_ttreg)[1];
        let score = (mode === MODE_ENDLESS ? cps : _gameScore);
        let best = getBestScore(score);
        l.attr('class', l.attr('class').replace(/bgc\d/, 'bgc' + c));
        $('#GameScoreLayer-text').html(shareText(cps));
        let normalCond = legalDeviationTime() || mode !== MODE_NORMAL;
        l.css('color', normalCond ? '': 'red');

        $('#cps').text(cps.toFixed(2));
        $('#score').text(scoreToString(score));
        $('#GameScoreLayer-score').css('display', mode === MODE_ENDLESS ? 'none' : '');
        $('#best').text(scoreToString(best));

        l.css('display', 'block');
    }

    function hideGameScoreLayer() {
        $('#GameScoreLayer').css('display', 'none');
    }

    w.replayBtn = function() {
        gameRestart();
        hideGameScoreLayer();
    }

    w.backBtn = function() {
        gameRestart();
        hideGameScoreLayer();
        showWelcomeLayer();
    }

    function shareText(cps) {
        if (mode === MODE_NORMAL) {
            let date2 = new Date();
            deviationTime = (date2.getTime() - _date1.getTime())
            if (!legalDeviationTime()) {
                return I18N['time-over'] + ((deviationTime / 1000) - _gameSettingNum).toFixed(2) + 's';
            }
            SubmitResults();
        }

        if (cps <= 5) return I18N['text-level-1'];
        if (cps <= 8) return I18N['text-level-2'];
        if (cps <= 10)  return I18N['text-level-3'];
        if (cps <= 15) return I18N['text-level-4'];
        return I18N['text-level-5'];
    }

    function toStr(obj) {
        if (typeof obj === 'object') {
            return JSON.stringify(obj);
        } else {
            return obj;
        }
    }

    function cookie(name, value, time) {
        if (name) {
            if (value) {
                if (time) {
                    let date = new Date();
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
        let data = {};
        value = document.cookie.replace(/\s/g, "").split(";");
        for (let i = 0; value.length > i; i++) name = value[i].split("="), name[1] && (data[name[0]] = unescape(name[1]));
        return data;
    }

    document.write(createGameLayer());

    function initSetting() {
        $("#username").val(cookie("username") ? cookie("username") : "");
        $("#message").val(cookie("message") ? cookie("message") : "");
        if (cookie("title")) {
            $('title').text(cookie('title'));
            $('#title').val(cookie('title'));
        }
        let keyboard = cookie('keyboard');
        if (keyboard) {
            keyboard = keyboard.toString().toLowerCase();
            $("#keyboard").val(keyboard);
            map = {}
            map[keyboard.charAt(0)] = 1;
            map[keyboard.charAt(1)] = 2;
            map[keyboard.charAt(2)] = 3;
            map[keyboard.charAt(3)] = 4;
        }
        if (cookie('gameTime')) {
            $('#gameTime').val(cookie('gameTime'));
            _gameSettingNum = parseInt(cookie('gameTime'));
            gameRestart();
        }
    }

    w.show_btn = function() {
        $("#btn_group,#desc").css('display', 'block')
        $('#setting').css('display', 'none')
    }

    w.show_setting = function() {
        $('#btn_group,#desc').css('display', 'none')
        $('#setting').css('display', 'block')
        $('#sound').text(soundMode === 'on' ? I18N['sound-on'] : I18N['sound-off']);
    }

    w.save_cookie = function() {
        const settings = ['username', 'message', 'keyboard', 'title', 'gameTime'];
        for (let s of settings) {
            let value=$(`#${s}`).val();
            if(value){
                cookie(s, value.toString(), 100);
            }
        }
        initSetting();
    }

    function isnull(val) {
        let str = val.replace(/(^\s*)|(\s*$)/g, '');
        return str === '' || str === undefined || str == null;
    }

    w.goRank = function() {
        let name = $("#username").val();
        let link = './rank.php';
        if (!isnull(name)) {
            link += "?name=" + name;
        }
        window.location.href = link;
    }

    function click(index) {
        if (!welcomeLayerClosed) {
            return;
        }

        let p = _gameBBList[_gameBBListIndex];
        let base = parseInt($(`#${p.id}`).attr("num")) - p.cell;
        let num = base + index - 1;
        let id = p.id.substring(0, 11) + num;

        let fakeEvent = {
            clientX: ((index - 1) * blockSize + index * blockSize) / 2 + body.offsetLeft,
            // Make sure that it is in the area
            clientY: (touchArea[0] + touchArea[1]) / 2,
            target: document.getElementById(id),
        };

        gameTapEvent(fakeEvent);
    }

    const clickBeforeStyle = $('<style></style>');
    const clickAfterStyle = $('<style></style>');
    clickBeforeStyle.appendTo($(document.head));
    clickAfterStyle.appendTo($(document.head));

    function saveImage(dom, callback) {
        if (dom.files && dom.files[0]) {
            let reader = new FileReader();
            reader.onload = function() {
                callback(this.result);
            }
            reader.readAsDataURL(dom.files[0]);
        }
    }


    w.getClickBeforeImage = function() {
        $('#click-before-image').click();
    }

    w.saveClickBeforeImage = function() {
        const img = document.getElementById('click-before-image');
        saveImage(img, r => {
            clickBeforeStyle.html(`
                .t1, .t2, .t3, .t4, .t5 {
                   background-size: auto 100%;
                   background-image: url(${r});
            }`);
        })
    }

    w.getClickAfterImage = function() {
        $('#click-after-image').click();
    }

    w.saveClickAfterImage = function() {
        const img = document.getElementById('click-after-image');
        saveImage(img, r => {
            clickAfterStyle.html(`
                .tt1, .tt2, .tt3, .tt4, .tt5 {
                  background-size: auto 86%;
                  background-image: url(${r});
            }`);
        })
    }
}) (window);