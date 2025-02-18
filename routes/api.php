<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\CheckAdminAuth;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ServiceController;


/**  Public Routes  */
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::get('all-doc-list', [ServiceController::class, 'all_doc_list']);


/**  Auth Routes  */
Route::group(['middleware' => 'auth:api'], function () {
    Route::get('get-user-data', [AuthController::class, 'getUserData']);
    Route::get('logout', [AuthController::class, 'logout']);


    /**  Admin Routes  */
    Route::group(['middleware' => CheckAdminAuth::class], function () {
        Route::get('pending-authorization-doctors-list', [AdminController::class, 'pending_authorization_doctors_list']);
        Route::post('authorize-doctor', [AdminController::class, 'authorize_doctor']);
    });
});
