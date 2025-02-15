<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    echo "<pre>";
    print_r("welcome");
    die(" Test");
});
