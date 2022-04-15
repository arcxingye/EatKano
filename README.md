<p align="center">
  <a href="https://xingye.me/game/eatkano"><img src="https://github.com/arcxingye/EatKano/blob/main/static/image/ClickBefore.png?raw=true" width="100" height="100" alt="EatKano"></a>
</p>
<div align="center">

# EatKano

_🦌 网页小游戏 🥛_

</div>


## 简介

小游戏：吃掉小鹿乃

[English](README_EN.md)
|
[鹿乃b站](https://space.bilibili.com/316381099)
|
[线上版本](https://xingye.me/game/eatkano/index.php)
|
[Github Pages](https://arcxingye.github.io/EatKano/index.html)

## 可选功能

简易排行榜(日/周/月) 不推荐使用

不需要排行榜把php/sql文件都删掉即可

## 版本需求
+ MySQL 5+
+ PHP 5+

## 使用方法

按照这些步骤来配置排行榜的数据库

1. 创建数据库并且执行提供的脚本(这里用`kano`作为数据库名)
   ```sql
   CREATE DATABASE kano DEFAULT CHARSET=utf8;
   USE kano;
   SOURCE kano.sql;
   ```

2. 更改有数据库信息的`conn.php`为你的数据库配置

   ```php
   <?php
   // 把这里改为你的配置
   $link = new mysqli('localhost','NAME','PASSWORD','kano');
   mysqli_set_charset($link, 'utf8');
   if ($link->connect_error) {
       die("Failed to connect: " . $conn->connect_error);
   }
   $ranking = "kano_rank";
   ```


## 其它事项

点下star吧~ 欢迎pr代码

可修改和续写，需保留跳转此仓库的开源按钮

如整成自己想要的吃掉xxx，可以Fork一份改下图和字，并在github pages运行，不会请参考[视频教程](https://www.bilibili.com/video/BV1jT4y1y7kA)
