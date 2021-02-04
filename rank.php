<!DOCTYPE html>
<html>

<head>
  <title>吃掉小鹿乃-排行榜</title>
  <meta item="description" content="来看神仙" />
  <meta itemprop="image" content="https://www.thac.cc/kano/res/logo.jpg" />
  <meta charset="utf-8" />
  <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1.0" />
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
      <li class="breadcrumb-item"><a href="./index.php">继续肝</a></li>
      <li class="breadcrumb-item active" aria-current="page">Rank</li>
    </ol>
  </nav>
  <div class="page-header text-center">
    <h1>排行榜</h1>
    提示：必须完成20s才能上榜。不要总是想着作弊哦。<a href="https://space.bilibili.com/3853579">作者：星夜(联系/混个脸熟)</a>
  </div>
  <div class="list-group">
    <?php
    include('conn.php');
    $num = 30;
    $page = isset($_GET['page']) ? $_GET['page'] : 1;
    if ($page <= 0) {
      $page = $page + 1;
    }
    $offset = ($page - 1) * $num;
    //数据
    $result1 = mysqli_query($link, "SELECT * FROM kano1_rank ORDER BY score DESC limit {$offset},{$num}");
    $data = mysqli_fetch_all($result1);
    //长度
    $result2 = mysqli_query($link, "SELECT count(*) FROM kano1_rank");
    $count = mysqli_fetch_row($result2);
    if ($count[0] > $num * 9) {
      $count = $num * 9;
    } else {
      $count = $count[0];
    }
    $total = ceil($count / $num);
    if ($page >= $total) {
      $page = $page - 1;
    }
    $rank = $offset;
    foreach ($data as $row) :
      $rank += 1;
      echo "<a href='#' class='list-group-item list-group-item-action active'><div class='d-flex w-100 justify-content-between'>
            <h5 class='mb-1'>" . $rank . "位   " . $row[2] . "</h5><small>" . $row[3] . "</small></div><p class='mb-1'>SCORE: " . $row[1] . " -" . $row[4] . " -" . $row[5] . "</p>
            <small>".$row[6]."</small></a>";
    endforeach
    ?>
    <nav aria-label="Page navigation example">
      <ul class="pagination">
        <?php
        $total = ceil($count / $num);
        if ($page >= $total) {
          $page = $page - 1;
        }
        echo "<li class='page-item'>";
        echo "<a class='page-link' href='?page=" . ($page - 1) . "' aria-label='Previous'><span aria-hidden='true'>&laquo;</span></a></li>";
        for ($p = 1; $p <= $total; $p++) {
          echo "<li class='page-item'><a class='page-link' href='?page=" . $p . "'>" . $p . "</a></li>";
        }
        echo "<li class='page-item'><a class='page-link' href='?page=" . ($page + 1) . "' aria-label='Next'><span aria-hidden='true'>&raquo;</span></a></li>";
        ?>
      </ul>
    </nav>
  </div>
</body>