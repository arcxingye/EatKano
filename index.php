<!DOCTYPE html>
<html lang="zh">

<head>
    <title data-i18n="eat-kano"></title>
    <meta itemprop="name" content="吃掉小鹿乃" />
    <meta itemprop="description" content="新概念音游" />
    <meta charset="utf-8" />
    <meta name="viewport" content="initial-scale=1, user-scalable=no, minimum-scale=1.0, maximum-scale=1.0, width=device-width,target-densitydpi=device-dpi" />
    <link href="./static/index.css" rel="stylesheet" type="text/css">
    <script src="https://pv.sohu.com/cityjson?ie=utf-8"></script>
    <script src="https://code.createjs.com/1.0.0/createjs.min.js"></script>
    <script src="https://passport.cnblogs.com/scripts/jsencrypt.min.js"></script>
    <link href="https://cdn.staticfile.org/twitter-bootstrap/5.1.1/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.staticfile.org/twitter-bootstrap/5.1.1/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js"></script>
	<?php
    session_start();
    $str = substr(str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'), 0, 8);
    $_SESSION['t'] = $str;
    echo "<script>var tj='" . $str . "'</script>";
    ?>
</head>

<body onLoad="init()" oncontextmenu=self.event.returnValue=false>
    <div id="GameScoreLayer" class="BBOX SHADE bgc1" style="display:none;">
        <div style="padding:5%;margin-top: 200px;background-color: rgba(125, 181, 216, 0.3);">
                <div id="GameScoreLayer-text"></div>
                <div id="GameScoreLayer-CPS" class="mb-2 d-flex flex-row justify-content-center text-start">
                    <div class="col-3">CPS</div>
                    <div class="col-2" id="cps"></div>
                </div>
                <div id="GameScoreLayer-score" class="mb-2 d-flex flex-row justify-content-center text-start">
                    <div class="col-3" data-i18n="score"></div>
                    <div class="col-2" id="score"></div>
                </div>
                <div id="GameScoreLayer-bast" class="mb-2 d-flex flex-row justify-content-center text-start">
                    <div class="col-3" data-i18n="best"></div>
                    <div class="col-2" id="best"></div>
                </div>
                <button type="button" class="btn btn-secondary btn-lg" id="replay" onclick="replayBtn()" data-i18n="again">AGAIN-I18N</button>
                <button type="button" class="btn btn-secondary btn-lg" onclick="window.location.reload()" data-i18n="home">HOME-I18N</button>
                <button type="button" class="btn btn-secondary btn-lg" onclick="goRank()" data-i18n="rank">RANK-I18N</button>
                <button type="button" class="btn btn-secondary btn-lg" onclick="window.location.href='https://github.com/arcxingye/EatKano'" data-i18n="repo">REPO-I18N</button>
            </div>
    </div>
    </div>
    <div id="welcome" class="SHADE BOX-M">
        <div class="welcome-bg FILL"></div>
        <div class="FILL BOX-M" style="position:absolute;top:0;left:0;right:0;bottom:0;z-index:5;">
            <div class="container">
                <div class="container mb-5">
                    <div style="font-size:2.6em; color:#FEF002;" data-i18n="game-title">GAME-TITLE-I18N</div><br />
                    <div id="desc" style="display: block;font-size:2.2em; color:#fff; line-height:1.5em;">
                        <span data-i18n="game-intro1">GAME-INTRO1-I18N</span><br />
                        <span data-i18n="game-intro2">GAME-INTRO2-I18N</span><br />
                    </div>
                </div>
                <div id="btn_group" class="container text-nowrap">
                    <div class="d-flex justify-content-center flex-column flex-fill">
                        <a class="btn btn-primary btn-lg mb-3" onclick="readyBtn()" data-i18n="start">START-I18N</a>
                        <div class="dropdown mb-3">
                            <a class="w-100 btn btn-secondary btn-lg" href="javascript: void(0);" role="button" id="mode" data-bs-toggle="dropdown" aria-expanded="false" data-i18n="normal">NORMAL-I18N</a>
                            <ul class="dropdown-menu" aria-labelledby="mode">
                                <li><a class="dropdown-item" onclick="changeMode(MODE_NORMAL)" data-i18n="normal">NORMAL-I18N</a></li>
                                <li><a class="dropdown-item" onclick="changeMode(MODE_ENDLESS)" data-i18n="endless">ENDLESS-I18N</a></li>
                                <li><a class="dropdown-item" onclick="changeMode(MODE_PRACTICE)" data-i18n="practice">PRACTICE-I18N</a></li>
                            </ul>
                        </div>
                        <a class="btn btn-secondary btn-lg" onclick="show_setting()" data-i18n="settings">SETTINGS-I18N</a>
                    </div>
                </div>
                <div id="setting" class="container" style="display: none;">
                    <div class="container mb-3 btn-group">
                        <a data-i18n="img-before" type="button" class="btn text-nowrap btn-secondary me-1" onclick="getClickBeforeImage()" style="left: 0">IMG-BEFORE-I18N</a>
                        <input type="file" id="click-before-image" accept="image/*" class="d-none" onchange="saveClickBeforeImage()">
                        <a data-i18n="img-after" type="button" class="btn text-nowrap btn-secondary me-1" onclick="getClickAfterImage()" style="right: 0">IMG-AFTER-I18N</a>
                        <input type="file" id="click-after-image" accept="image/*" style="display: none;" onchange="saveClickAfterImage()">
                        <a id="sound" type="button" class="btn text-nowrap btn-secondary" onclick="changeSoundMode()"></a>
                    </div>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend col-2">
                            <span class="input-group-text" data-i18n="title">TITLE-I18N</span>
                        </div>
                        <input data-placeholder-i18n="eat-kano" type="text" id="title" class="form-control" placeholder="EAT-KANO-I18N">
                    </div>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend col-2">
                            <span data-i18n="key" class="input-group-text">KEY-I18N</span>
                        </div>
                        <input data-placeholder-i18n="default-dfjk" type="text" id="keyboard" class="form-control" maxlength=4 placeholder="DFJK-I18N">
                    </div>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend col-2">
                            <span data-i18n="time" class="input-group-text">TIME-I18N</span>
                        </div>
                        <input data-placeholder-i18n="default-20s" type="text" id="gameTime" class="form-control" maxlength=4 placeholder="default-20s">
                    </div>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend col-2">
                            <span class="input-group-text" data-i18n="name">NAME-I18N</span>
                        </div>
                        <input data-placeholder-i18n="record-rank" type="text" id="username" class="form-control" maxlength=8 placeholder="RECORD-RANK-I18N">
                    </div>
                    <div class="input-group mb-3">
                        <div class="input-group-prepend col-2">
                            <span class="input-group-text" data-i18n="comment">COMMENT-I18N</span>
                        </div>
                        <input data-placeholder-i18n="no-ad-bad-lang" type="text" id="message" class="form-control" maxlength=50 placeholder="NO-AD-BAD-LANG-I18N">
                    </div>
                    <button type="button" class="btn btn-secondary btn-lg" onclick="show_btn();save_cookie();" data-i18n="ok">OK-I18N</button>
                </div>
            </div>
        </div>
    </div>

    <script src="./static/index.js"></script>
</body>

</html>