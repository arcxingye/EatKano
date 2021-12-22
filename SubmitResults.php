<?php
include('conn.php');
$str = "/\ |\/|\~|\!|\@|\#|\\$|\%|\^|\&|\*|\(|\)|\_|\+|\{|\}|\:|\<|\>|\?|\[|\]|\,|\.|\/|\;|\'|\`|\-|\=|\\\|\|/";
$score = preg_replace($str, "", $_POST['score']);
$name = preg_replace($str, "", $_POST['name']);
$systeminfo = preg_replace($str, "", $_POST['systeminfo']);
$area = preg_replace($str, "", $_POST['area']);
$message = preg_replace($str, "", $_POST['message']);
if ((strlen($name) <= 30)&&($score < 250)&&($message <= 150)&&(is_numeric($score))&&(is_string($systeminfo))) {
    $record_sql="SELECT id FROM ".$ranking." WHERE name=?";
    $record_stmt = $link->prepare($record_sql);
    $record_stmt->bind_param("s",$name);
    $record_stmt->execute();
    $record_stmt->store_result();
    $rows=$record_stmt->num_rows;
    $record_stmt->close();
    if ($rows>0) {
        $operation_sql = "UPDATE ".$ranking." SET score=?,time=NOW(),systeminfo=?,area=?,message=? WHERE name=?";
    } else {
        $operation_sql = "INSERT INTO ".$ranking." (score,time,systeminfo,area,message,name) VALUES (?,NOW(),?,?,?,?)";
    }
    if ($operation_sql) {
        $operation_stmt = $link->prepare($operation_sql);
        $operation_stmt->bind_param('issss', $score, $systeminfo, $area, $message, $name);
        $operation_stmt->execute();
        $operation_stmt->close();
    }
    $link->close();
}