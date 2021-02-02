<?php
include('conn.php');
$name = $_POST['name'];
$score = $_POST['score'];
$token = $_POST['token'];
if ((strlen($name) < 27)&&($score<300)) {
    preg_replace("/\ |\/|\~|\!|\@|\#|\\$|\%|\^|\&|\*|\(|\)|\_|\+|\{|\}|\:|\<|\>|\?|\[|\]|\,|\.|\/|\;|\'|\`|\-|\=|\\\|\|/", "", $name);
    $result = mysqli_query($link, "SELECT * FROM kano1_rank WHERE name='$name' limit 1");
    $data = mysqli_fetch_all($result);
    if ($data) {
        if ($score > $data[0][1]) {
            $sql = "UPDATE kano1_rank SET score=?,time=NOW() WHERE name=?";
        }
    } else {
        $sql = "INSERT INTO kano1_rank (score,name,time) VALUES (?, ?,NOW())";
    }
    if ($sql) {
        $stmt = $link->prepare($sql);
        $stmt->bind_param('is', $score, $name);
        $stmt->execute();
    }
}
