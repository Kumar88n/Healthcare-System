<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);


Route::group(['middleware' => 'auth:api'], function () {
    Route::get('get-user-data', [AuthController::class, 'getUserData']);
    Route::get('logout', [AuthController::class, 'logout']);
});
