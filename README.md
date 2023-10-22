<p align="center">
  <a href="https://fgfobdpqjs.github.io/CHICXK/index.html"><img src="https://github.com/fgfobdpqjs/fgfobdpqjs.github.io/blob/main/CHICXK/static/image/ClickBefore.png?raw=true" width="100" height="100" alt="吃掉蔡徐坤"></a>
</p>
<div align="center">

# 吃掉蔡徐坤

_🦌 网页小游戏 🥛_

</div>


## 简介

小游戏：吃掉蔡徐坤

[English](README_EN.md)
|
[鹿乃b站](https://space.bilibili.com/316381099)
|
[线上版本](https://fgfobdpqjs.github.io/CHICXK/index.html)
|
[Github Pages](https://fgfobdpqjs.github.io/CHICXK/index.html)

## 可选功能

简易排行榜(日/周/月) 不推荐使用

不需要排行榜把php/sql文件都删掉即可

## 版本需求
+ MySQL 5+
+ PHP 5+

## 使用方法

注: 如果你想玩的话直接去玩就可以, 这里是如何制造你的改版

### Github Pages

点 [这里](https://www.bilibili.com/video/BV1r94y1d765) 看视频步骤

如果你不需要排行榜, 那么部署到Github Pages即可.

按照如下方法更改你想要显示的文字

1. **Fork本项目,不要在现在这个页面直接改,然后发现改不了.**

2. **打开你Fork的项目**, 找到`static/i18n/zh.json`, 找到下面这几项配置

   ```json
   {
     "game-title": "新概念音游",
     "game-intro1": "从最底下的开始 看你能得多少分",
     "game-intro2": "OK! 蔡徐坤一个不留！",
     "text-level-1": "试着好好练个两年半?",
     "text-level-2": "还没到KUN的程度那!",
     "text-level-3": "马上就要超过KUN的程度那!",
     "text-level-4": "你应该已经练了2.5年了吧!",
     "text-level-5": "坤坤:又有一位IKUN加入我们的荔枝集团了!"
   }
   ```

   你可以随意更改右侧文字, 就可以显示你想要的内容 **不要删掉双引号**

3. 找到`static/image`文件夹, 点击前显示的图片是`ClickBefore.png`, 点击后的图片是`ClickAfter.png`, 把他们改成你想要的即可.

    **注意文件格式, 需要是png**

4. 找到`static/music`文件夹, 点击时的音效是`tap.mp3`, 正常结束的音效是`end.mp3`, 点击错误的音效是`err.mp3`, 把他们改成你想要的即可.

   **注意文件格式, 需要是mp3**

5. 更改完毕后前往项目的`Settings` -> `Pages` -> `Source`, 选择`main` 分支然后点击`Save`.

### 部署到服务器

按照这些步骤来在你的服务器上配置排行榜的数据库

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
