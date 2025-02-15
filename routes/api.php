<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;

Route::group(['middleware' => 'auth:api'], function () {
    Route::get('/user', function () {
        return Auth::user();
    });
});
