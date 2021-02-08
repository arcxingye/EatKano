<?php
session_start();
require 'Decipher.php';
include('conn.php');
$ciphertext = $_POST['ciphertext'];
$decipherList = decipher($ciphertext);
$score = $decipherList[0];
$name = $_POST['name'];
$area = $_POST['area'];
$systeminfo = $decipherList[1];
$message = $_POST['message'];
if ((strlen($name) <= 30) && ($score < 300) && ($message <= 150) && ($_POST['t'] == $_SESSION['t']) && (is_numeric($score)) && (is_string($systeminfo))) {
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
            $sql = "UPDATE kano1_rank SET score=?,time=NOW(),systeminfo=?,area=?,message=? WHERE name=?";
        }
    } else {
        $sql = "INSERT INTO kano1_rank (score,time,systeminfo,area,message,name) VALUES (?,NOW(),?,?,?,?)";
    }
    if ($sql) {
        $stmt = $link->prepare($sql);
        $stmt->bind_param('issss', $score, $systeminfo, $area, $message, $name);
        $stmt->execute();
    }
}
