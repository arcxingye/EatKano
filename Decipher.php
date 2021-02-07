<?php
    require "vendor/autoload.php";
    use Brick\Math\BigInteger;
    function decipher($ciphertext) {
        $temp = explode('-', $ciphertext);
        $result = array();
        $result[0] = '';
        $length = count($temp);
        $index = 0;
        for ($i = 0; $i < $length; $i++) {
            $ch = chr(BigInteger::of((int)$temp[$i])->power(1325)->remainder(3431)->toInt());
            if ($ch != ' ') $result[$index] .= $ch;
            else $result[++$index] = '';
        }
        return $result;
    }
?>