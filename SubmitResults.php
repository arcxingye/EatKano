<?php
include('conn.php');
$str = "/\ |\/|\~|\!|\@|\#|\\$|\%|\^|\&|\*|\(|\)|\_|\+|\{|\}|\:|\<|\>|\?|\[|\]|\,|\.|\/|\;|\'|\`|\-|\=|\\\|\|/";
$score = preg_replace($str, "", $_POST['score']);
$name = preg_replace($str, "", $_POST['name']);
$system = preg_replace($str, "", $_POST['system']);
$area = preg_replace($str, "", $_POST['area']);
$message = preg_replace($str, "", $_POST['message']);
if ((strlen($name) <= 30) && ($score < 300) && ($message <= 150) && (is_numeric($score)) && (is_string($system))) {
    $score_sql = "SELECT score,attempts FROM " . $ranking . " WHERE name=?";
    $score_stmt = $link->prepare($score_sql);
    $score_stmt->bind_param("s", $name);
    $score_stmt->bind_result($highest, $attempts);
    $score_stmt->execute();
    if ($score_stmt->fetch()&&$score_stmt->close()) {
        $attempts += 1;
        if ($score > $highest) {
            $exec_sql = "UPDATE " . $ranking . " SET score=?,time=NOW(),system=?,area=?,message=?,attempts=? WHERE name=?";
        } else {
            $count_sql = "UPDATE " . $ranking . " SET attempts=? WHERE name=?";
            $count_stmt = $link->prepare($count_sql);
            $count_stmt->bind_param('is', $attempts, $name);
            $count_stmt->execute();
            $count_stmt->close();
        }
    } else {
        $attempts = 1;
        $exec_sql = "INSERT INTO " . $ranking . " (score,time,system,area,message,attempts,name) VALUES (?,NOW(),?,?,?,?,?)";
    }
    if ($exec_sql) {
        $exec_stmt = $link->prepare($exec_sql);
        $exec_stmt->bind_param('isssis', $score, $system, $area, $message, $attempts, $name);
        $exec_stmt->execute();
        $exec_stmt->close();
    }
    $link->close();
}
