<p align="center">
  <a href="https://chicxk.pages.dev/"><img src="https://chicxk.pages.dev/static/image/ClickBefore.png" width="100" height="100" alt="EatKun"></a>
</p>
<div align="center">

# EatKun

_🦌 Web Game 🥛_

</div>


## Introduction

A web game: EatKun

[Chinese](README.md)
|
[GitHub](https://github.com/fgfobdpqjs)
|
[Play](https://chicxk.pages.dev/)

## Features

A simple ranking list(day/week/month) is provided.

You can delete all the sql/php files if you don't need them.

## Requirements
+ MySQL 5+
+ PHP 5+

## Usage

Note: if you just want to play it, go to [online version](https://fgfobdpqjs.github.io/CHICXK/index.html). Here is how to create your own version.

### Github Pages

You can run it on Github Pages if you don't need the ranking list.

Follow these steps to change the text displayed to what you want.

1. **Fork this repository. DON'T CHANGE DIRECTLY IN THIS PROJECT.**

2. **Open the repo you forked.** Go to `static/i18n/en.json` and find these texts below

   ```json
   {
     "game-title": "New concept audio game",
     "game-intro1": "Start at the bottom and",
     "game-intro2": "see how many points you can get",
     "game-intro3": "OK!",
     "game-intro4": "Cai Xukun does not leave one! ",
     "text-level-1": "Try to practice well for two and a half years?",
     "text-level-2": "Not yet to the level of KUN!",
     "text-level-3": "Soon to surpass KUN!",
     "text-level-4": "You should have been practicing for 2.5 years!",
     "text-level-5": "Kunkun: Another IKUN has joined our Litchi Group!"
   }
   ```

   You can change the text on the right side. **Note that don't remove quotes(i.e. `"`)**

3. Go to directory `static/image`. The image shown before clicking is `ClickBefore.png`, and after is `ClickAfter.png`.

   **The file type must be png**

4. Go to directory `static/music`. The sound played when tapping is `tap.mp3`, when ending without errors is `end.mp3`, while ending with errors is `err.mp3`.

   **The file type must be mp3**

5. After changing all resources to your own, go to repository `Settings` -> `Pages` -> `Source`, choose `main` branch and click `Save`.

### Deploying to Server

Follow these few steps to configure the database for ranking list on your server.

1. Remove the 0 in username0 in `index.js`, remove the 0 in message0, remove the 0 in username0 in `index.php`, and remove the 0 in message0

2. Create your own database and execute the script provided(e.g. use `kun` as database name).
   
   ```sql
   CREATE DATABASE kun DEFAULT CHARSET=utf8;
   USE kun;
   SOURCE kun.sql;
   ```
   
3. Change the code in `conn.php`, which contains your database info, and its content is here.

   ```php
   <?php
   // Change this to your own configuration
   $link = new mysqli('localhost','NAME','PASSWORD','kun');
   mysqli_set_charset($link, 'utf8');
   if ($link->connect_error) {
       die("Failed to connect: " . $conn->connect_error);
   }
   $ranking = "kun_rank";
   ```

## Used items and their licenses

1. EatKano ([GitHub](https://github.com/arcxingye/EatKano) [License: MIT license](https://github.com/arcxingye/EatKano/raw/refs/heads/main/LICENSE))

2. Bootstrap v5.1.1 ([Websize](https://getbootstrap.com/) [GitHub](https://github.com/twbs/bootstrap/releases/tag/v5.1.1) [License: MIT license](https://raw.githubusercontent.com/twbs/bootstrap/refs/heads/main/LICENSE))

3. CREATEJS v1.0.0 ([Websize](http://createjs.com/) [GitHub](https://github.com/CreateJS/CreateJS) [License: MIT license](https://raw.githubusercontent.com/CreateJS/CreateJS/refs/heads/master/LICENSE))

4. jQuery 3.6.0 ([Websize](https://jquery.com/) [GitHub](https://github.com/jquery/jquery/releases/tag/3.6.0) [License](https://raw.githubusercontent.com/jquery/jquery/refs/heads/main/LICENSE.txt))

5. JSEncrypt ([Websize](https://travistidwell.com/jsencrypt) [GitHub](https://github.com/travist/jsencrypt) [License: MIT license](https://raw.githubusercontent.com/travist/jsencrypt/refs/heads/master/LICENSE.txt))

## Others

This project is licensed under the [BSD 3-Clause License](https://raw.githubusercontent.com/fgfobdpqjs/EatKun/refs/heads/main/LICENSE). When using this project, please acknowledge the original author and do not publish under the original author's name.