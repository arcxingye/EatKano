<p align="center">
  <a href="https://xingye.me/game/eatkano"><img src="https://github.com/arcxingye/EatKano/blob/main/static/image/ClickBefore.png?raw=true" width="100" height="100" alt="EatKano"></a>
</p>

<div align="center">

# EatKano

_🦌 Web Game 🥛_

</div>


## Introduction
A web game: EatKano

[Kano's Twitter](https://twitter.com/kano_2525)
|
[Online Version](https://xingye.me/game/eatkano/index.php)
|
[Github Pages](https://arcxingye.github.io/EatKano/index.html)

## Features

A simple ranking list(day/week/month) is provided.

You can delete all the sql/php files if you don't need them.

## Required
+ MySQL 5+
+ PHP 5+

## Usage

Follow these few steps to configure the database for ranking list.

1. Create your own database and execute the script provided(e.g. use `kano` as database name).
   
   ```sql
   CREATE DATABASE kano DEFAULT CHARSET=utf8;
   USE kano;
   SOURCE kano.sql;
   ```
   
2. Change the code in `conn.php`, which contains your database info, and its content is here.

   ```php
   <?php
   // Change this to your own configuration
   $link = new mysqli('localhost','NAME','PASSWORD','kano');
   mysqli_set_charset($link, 'utf8');
   if ($link->connect_error) {
       die("Failed to connect: " . $conn->connect_error);
   }
   $ranking = "kano_rank";
   ```

   


## Others

Please star us~

Welcome to pull request!
