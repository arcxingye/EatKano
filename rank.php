<!DOCTYPE html>
<html>

<head>
    <title>吃掉小鹿乃</title>
    <meta item="description" content="你无聊吗？" />
    <meta itemprop="image" content="https://www.thac.cc/kano/res/logo.jpg" />
    <meta charset="utf-8" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    <script>
        var _hmt = _hmt || [];
        (function() {
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?d41fa227018de3772f58108c76d3dfd5";
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        })();
    </script>
</head>

<body>
<nav aria-label="breadcrumb">
  <ol class="breadcrumb">
    <li class="breadcrumb-item"><a href="./index.php">Home</a></li>
    <li class="breadcrumb-item active" aria-current="page">Rank</li>
  </ol>
</nav>
<div class="page-header text-center">
    <h1>排行榜</h1>
    提示：必须完成20s才能上榜，不要总是想着作弊哦。作者：<a href="https://space.bilibili.com/3853579">星夜 (混个脸熟)</a>
</div>
<div class="card">
  <div class="card-body">
  <div class="list-group">
        <?php
        include('conn.php');
        $result = mysqli_query($link, "SELECT * FROM kano1_rank ORDER BY score DESC limit 100");
        $data = mysqli_fetch_all($result);
        $rank=0;
        foreach ($data as $xr) :
            $rank+=1;
            echo "<a href='#' class='list-group-item list-group-item-action active'>
<div class='d-flex w-100 justify-content-between'>
  <h5 class='mb-1'>" . $rank ."位   ". $xr[2] . "</h5>
  <small>" . $xr[3] . "</small>
</div>
<p class='mb-1'>SCORE: " . $xr[1] . "</p>
</a>";
        endforeach
        ?>
    </div>
  </div>
</div>
</body>