<?php
$link = new mysqli('localhost', '', '', '');
mysqli_set_charset($link, 'utf8');
if ($link->connect_error) {
    die("连接失败: " . $conn->connect_error);
}
//表字段 id score name time