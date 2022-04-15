<!DOCTYPE html>
<html lang="en">

<head>
  <title>EatKano-Ranking</title>
  <meta item="description" content="EatKano" />
  <meta charset="utf-8" />
  <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1.0" />
  <link href="https://cdn.staticfile.org/twitter-bootstrap/5.1.1/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdn.staticfile.org/twitter-bootstrap/5.1.1/js/bootstrap.bundle.min.js"></script>
  <script src="https://libs.baidu.com/jquery/2.0.0/jquery.min.js"></script>
</head>

<body>
  <?php
  @require 'conn.php';
  session_start();
  //Maximum number of pages that can be displayed
  $max_pages = 9;
  $RankingType = isset($_GET['type']) ? $_GET['type'] : 'day';
  //Number of items that can be displayed on each page
  $num = 10;
  $CurrentPage = isset($_GET['page']) && is_numeric($_GET['page']) ? $_GET['page'] : 1;
  if (isset($_GET['name'])) {
    $_SESSION['name'] = $_GET['name'];
  }
  $offset = ($CurrentPage - 1) * $num;
  if ($RankingType == 'query') {
    $queryname = isset($_GET['query']) ? $_GET['query'] : '';
    $title = "Query Record";
    $cond1 = "where name=?";
    $cond2 = $cond1.";";
  }
  if ($RankingType == 'day') {
    $title = "Ranking[day]";
    $cond1 = "where to_days(time) = to_days(now())";
    $cond2 = $cond1 . " ORDER BY score DESC limit ?,?;";
  }
  if ($RankingType == 'week') {
    $title = "Ranking[week]";
    $cond1 = "where DATE_SUB(CURDATE(), INTERVAL 7 DAY) <= date(time)";
    $cond2 = $cond1 . " ORDER BY score DESC limit ?,?;";
  }
  if ($RankingType == 'month') {
    $title = "Ranking[month]";
    $cond1 = "where DATE_SUB(CURDATE(), INTERVAL 30 DAY) <= date(time)";
    $cond2 = $cond1 . " ORDER BY score DESC limit ?,?;";
  }
  if ($RankingType == 'all') {
    $title = "Ranking[all]";
    $cond1 = "";
    $cond2 = "ORDER BY score DESC limit ?,?;";
  }
  ?>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <a class="navbar-brand" href="/">EatKano</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <a class="nav-link <?php echo $RankingType == 'day'?"active":""; ?>" href="?type=day">Daily ranking</a>
          </li>
          <li class="nav-item">
            <a class="nav-link <?php echo $RankingType == 'week'?"active":""; ?>" href="?type=week">Weekly ranking</a>
          </li>
          <li class="nav-item">
            <a class="nav-link <?php echo $RankingType == 'month'?"active":""; ?>" href="?type=month">Monthly ranking</a>
          </li>
          <li class="nav-item">
            <a class="nav-link <?php echo $RankingType == 'all'?"active":""; ?>" href="?type=all">All ranking</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="https://github.com/arcxingye/EatKano/">Source code</a>
          </li>
        </ul>
        <form class="d-flex" action="" onsubmit="return func()">
          <input class="form-control me-2" id="search" placeholder="Name to query">
          <button class="btn btn-outline-success" onclick="local()">Search</button>
        </form>
        <script>
          function func() {
            return false;
          }

          function local() {
            if ($('#search').val()) {
              window.location.href = "?type=query&query=" + $('#search').val();
            } else {
              alert("Name not filled in")
            }
          }
        </script>
      </div>
    </div>
  </nav>
  <div style="max-width:640px;margin:0 auto;">
    <div class="page-header text-center">
      <br />
      <h1><?php echo $title; ?></h1><br />
    </div>
    <div class="list-group">
      <?php
      $rank = $offset;
      $data_sql = "SELECT * FROM " . $ranking . " " . $cond2 . ";";
      if ($data_stmt = $link->prepare($data_sql)) {
        if ($RankingType == "query") {
          $data_stmt->bind_param("s", $queryname);
        } else {
          $data_stmt->bind_param("ii", $offset, $num);
        }
        $data_stmt->execute();
        $data_stmt->store_result();
        $data_stmt->bind_result($id, $score, $name, $time, $system, $area, $message, $attempts);
        if ($data_stmt->num_rows > 0) {
          while ($data_stmt->fetch()) {
            $rank += 1;
            echo "<a href='#' class='list-group-item list-group-item-action'><div class='d-flex w-100 justify-content-between'>
            <h5 class='mb-1'>" . (($rank == 1 || $rank % 10 == 1) ? ($rank . "st ") : (($rank == 2 || $rank % 10 == 2) ? ($rank . "rd ") : ($rank . "th "))) . $name . "</h5><small>" . $time . "</small></div>
            <p class='mb-1'>SCORE: " . $score . " TRY: " . $attempts . " -" . $system . " -" . $area . "</p>
            <small>" . ($message ? $message : "No message") . "</small></a>";
          }
        } else {
          echo "<br/><br/><p class='text-center'>There is no data yet<p>";
        }
        $data_stmt->close();
      }
      ?>
      <nav aria-label="Page navigation example" style="margin-bottom:3em;">
        <ul class="pagination">
          <?php
          if ($RankingType != "query") {
            $rows_sql = "SELECT count(*) FROM " . $ranking . " " . $cond1;
            $rows_data = mysqli_query($link, $rows_sql);
            $rows = mysqli_fetch_row($rows_data)[0];
            $rows = $rows > $num * $max_pages ? $num * $max_pages : $rows;
            $total = ceil($rows / $num);
            if ($total > 1) {
              if ($CurrentPage > 1) {
                echo "<li class='page-item'><a class='page-link' href='?type=" . $RankingType . "&page=" . ($CurrentPage - 1) . "' aria-label='Previous'><span aria-hidden='true'>&laquo;</span></a></li>";
              }
              for ($p = 1; $p <= $total; $p++) {
                echo "<li class='page-item " . ($CurrentPage == $p ? "active" : "") . "'><a class='page-link' href='?type=" . $RankingType . "&page=" . $p . "'>" . $p . "</a></li>";
              }
              if ($total > $CurrentPage) {
                echo "<li class='page-item'><a class='page-link' href='?type=" . $RankingType . "&page=" . ($CurrentPage + 1) . "' aria-label='Next'><span aria-hidden='true'>&raquo;</span></a></li>";
              }
            }
          }
          ?>
        </ul>
      </nav>
    </div>
    <footer class='fixed-bottom container' style='max-width:640px;'>
      <div class='row shadow rounded bg-light'>
        <div style='padding:0.2em 1em;'>
          <?php
          if (isset($_SESSION['name'])) {
            //Query current user history
            $score_sql = "SELECT `score`,`time`,`attempts` FROM " . $ranking . " where name=?";
            $score_stmt = $link->prepare($score_sql);
            $score_stmt->bind_param("s", $_SESSION['name']);
            $score_stmt->bind_result($score, $time, $attempts);
            $score_stmt->execute();
            if ($score_stmt->fetch()) {
              echo $_SESSION['name'] . " highest record. Uploaded " . $attempts . " times<br/>" . "SCORE:" . $score . " " . $time;
            } else {
              echo "No record of " . $_SESSION['name'] . " (Or filtered)";
            }
            $score_stmt->close();
          } else {
            echo "Tip: you didn't fill in your name before playing";
          }
          $link->close();
          ?>
        </div>
      </div>
    </footer>
  </div>
</body>

</html>