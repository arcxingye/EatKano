<?php
include('conn.php');
$str = "/\ |\/|\~|\!|\@|\#|\\$|\%|\^|\&|\*|\(|\)|\_|\+|\{|\}|\:|\<|\>|\?|\[|\]|\,|\.|\/|\;|\'|\`|\-|\=|\\\|\|/";
$score = preg_replace($str, "", $_POST['score']);
$name = preg_replace($str, "", $_POST['name']);
$system = preg_replace($str, "", $_POST['system']);
$area = preg_replace($str, "", $_POST['area']);
$message = preg_replace($str, "", $_POST['message']);
if (!empty($name)&&(strlen($name) <= 30) && ($score < 300) && ($message <= 150) && (is_numeric($score)) && (is_string($system))) {
    $score_sql = "SELECT score,attempts FROM " . $ranking . " WHERE name=?";
    $score_stmt = $link->prepare($score_sql);
    $score_stmt->bind_param("s", $name);
    $score_stmt->bind_result($highest, $attempts);
    $score_stmt->execute();
    if ($score_stmt->fetch()&&$score_stmt->close()) {
        $attempts += 1;
        if ($score > $highest) {
            $update_sql = "UPDATE " . $ranking . " SET score=?,time=NOW(),system=?,area=?,message=?,attempts=? WHERE name=?";
            $update_stmt = $link->prepare($update_sql);
            $update_stmt->bind_param('isssis', $score, $system, $area, $message, $attempts, $name);
            $update_stmt->execute();
            $update_stmt->close();
        } else {
            $count_sql = "UPDATE " . $ranking . " SET attempts=? WHERE name=?";
            $count_stmt = $link->prepare($count_sql);
            $count_stmt->bind_param('is', $attempts, $name);
            $count_stmt->execute();
            $count_stmt->close();
        }
    } else {
        $attempts = 1;
        $insert_sql = "INSERT INTO " . $ranking . " (score,time,system,area,message,attempts,name) VALUES (?,NOW(),?,?,?,?,?)";
        $insert_stmt = $link->prepare($insert_sql);
        $insert_stmt->bind_param('isssis', $score, $system, $area, $message, $attempts, $name);
        $insert_stmt->execute();
        $insert_stmt->close();
    }
    $link->close();
}
