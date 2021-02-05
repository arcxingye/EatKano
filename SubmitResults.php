<?php
session_start();
include('conn.php');
$score = $_POST['score'];
$name = $_POST['name'];
$area = $_POST['area'];
$systeminfo = $_POST['systeminfo'];
$message = $_POST['message'];
if ((strlen($name) <= 30) && ($score < 244)&& ($message <= 150)&&($_POST['t']==$_SESSION['t'])) {
    $str1 = "/\ |\/|\~|\!|\@|\#|\\$|\%|\^|\&|\*|\(|\)|\_|\+|\{|\}|\:|\<|\>|\?|\[|\]|\,|\.|\/|\;|\'|\`|\-|\=|\\\|\|/";
    $str2 = "/\ |\/|\@|\#|\\$|\%|\^|\&|\*|\(|\)|\_|\+|\{|\}|\:|\<|\>|\[|\]|\/|\;|\'|\`|\-|\=|\\\|\|/";
    preg_replace($str1, "", $name);
    preg_replace($str1, "", $systeminfo);
    preg_replace($str1, "", $area);
    preg_replace($str2, "", $message);
    $result = mysqli_query($link, "SELECT * FROM kano1_rank WHERE name='$name' limit 1");
    $data = mysqli_fetch_all($result);
    if ($data) {
        if ($score > $data[0][1]) {
            $sql="UPDATE kano1_rank SET score=?,time=NOW(),systeminfo=?,area=?,message=? WHERE name=?";
        }
    } else {
        $sql="INSERT INTO kano1_rank (score,time,systeminfo,area,message,name) VALUES (?,NOW(),?,?,?,?)";
    }
    if($sql){
        $stmt = $link->prepare($sql);
        $stmt->bind_param('issss', $score, $systeminfo, $area, $message, $name);
        $stmt->execute();
    }
}