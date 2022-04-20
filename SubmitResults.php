<?php
@session_start();
define('TIME_LIMIT', 5);
$time = time();
if (isset($_SESSION['time'])) {
    if ($time - $_SESSION['time'] <= TIME_LIMIT) {
        echo 'Only 1 upload in 5 seconds';
        exit();
    }
}
$_SESSION['time'] = $time;
$encryptString = file_get_contents("php://input");
$decrypted = '';
$key       = "MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBANPMbBfoVUpzusOLIXcf6MqkGVEJXiM6InglHfepk9VfHxqFbput0EX0fW90cEDI7oB5gG6YojK6dc/3HO+zWol1E2E2hXAcLAYO7tMD5Tgzsb0UCsMbRjqTgttLQqz3N5EEyJaRbnfJCU+yGG07FcK5lk4wuqTW8S9MI4NhipflAgMBAAECgYEAl4bN4sDWnGB1wsZ8V8SdgLSsZBymm99Qn9I2QWSyHlpiX1ANFRXiRtonD6EnWkIm2AWVTAqpKE/cT8AElL0lTJpZdUxsb7Y6nZvbFEmkpFA183f9pzkFjBAxW21RQJMW5MzSnUhYXVZr7AgUaxMDy7M2RMFZ/5XbwKwuNGaT5qECQQD5jCvnlpVmq5tTmIGRy+o18WtQdZRvEvkRAhRw8qAowZtBhCO+ycMtQKCwVDya8aDUItzrIBrzGv2eOfBndZqpAkEA2UZg/nGwpcDd7EVU3XltU5t3cX3wLhUZp1bDv3OZql44h0V2p+p1Oa2qVrF2JmbTu1gWn2YsOFlktrbogKP03QJBAIrXaUoVpxQToH0XWeeza6ENrCZ89NQD212SKatZ4rAqX+ZIzdaFzTjtPzo78+hFTbUZnI6ZM0VVHAyfsdjuPtkCQDAJED6QsgYjOq0Wsul4BASc9W5A8o2tmotVcldsXke9JvA5Gj+LZTlIPMWH3GAnEZ50niPFefdHRC3lCEgQd30CQQDbEqFoSCM4sEHih9h8b3V88X7X/sAbWk+rDnGy6TITplPZrLsBWu3D14VMpiCcNQ1ms6RKZxUFwNZXYynQNrhp";
$key_eol   = (string) implode("\n", str_split((string) $key, 64));
$privateKey = (string) "-----BEGIN PRIVATE KEY-----\n" . $key_eol . "\n-----END PRIVATE KEY-----";
@openssl_private_decrypt(base64_decode($encryptString), $decrypted, $privateKey);
$arr = explode('|_|', $decrypted);

$str = "/\ |\/|\~|\!|\@|\#|\\$|\%|\^|\&|\*|\(|\)|\_|\+|\{|\}|\:|\<|\>|\?|\[|\]|\,|\.|\/|\;|\'|\`|\-|\=|\\\|\|/";
$score = preg_replace($str, "", $arr[0]);
$name = preg_replace($str, "", $arr[1]);
$t = preg_replace($str, "", $arr[2]);
$system = preg_replace($str, "", $arr[3]);
$area = preg_replace($str, "", $arr[4]);
$message = preg_replace($str, "", $arr[5]);

if ((!empty($name)) && (strlen($name) <= 30) && (strlen($system) <= 30) && (strlen($area) <= 30) && (strlen($message) <= 150) && (is_numeric($score)) && ($score < 300) && ($t == $_SESSION['t'])) {
    @require 'conn.php';
    $score_sql = "SELECT `score`,`attempts` FROM " . $ranking . " WHERE `name`=?";
    $score_stmt = $link->prepare($score_sql);
    $score_stmt->bind_param("s", $name);
    $score_stmt->bind_result($highest, $attempts);
    $score_stmt->execute();
    $data = $score_stmt->fetch();
    $score_stmt->close();
    if (!empty($data)) {
        $attempts += 1;
        if ($score > $highest) {
            $update_sql = "UPDATE " . $ranking . " SET `score`=?,`time`=NOW(),`system`=?,`area`=?,`message`=?,`attempts`=? WHERE `name`=?";
            $update_stmt = $link->prepare($update_sql);
            $update_stmt->bind_param('isssis', $score, $system, $area, $message, $attempts, $name);
            $update_stmt->execute();
            $update_stmt->close();
        } else {
            $count_sql = "UPDATE " . $ranking . " SET `attempts`=? WHERE `name`=?";
            $count_stmt = $link->prepare($count_sql);
            $count_stmt->bind_param('is', $attempts, $name);
            $count_stmt->execute();
            $count_stmt->close();
        }
    } else {
        $attempts = 1;
        $insert_sql = "INSERT INTO " . $ranking . " (`score`,`time`,`system`,`area`,`message`,`attempts`,`name`) VALUES (?,NOW(),?,?,?,?,?)";
        $insert_stmt = $link->prepare($insert_sql);
        $insert_stmt->bind_param('isssis', $score, $system, $area, $message, $attempts, $name);
        $insert_stmt->execute();
        $insert_stmt->close();
    }
    $link->close();
}
