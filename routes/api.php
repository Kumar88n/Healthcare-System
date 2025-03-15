<?php

use Illuminate\Support\Facades\Route;
use App\Http\Middleware\CheckDocAuth;
use App\Http\Middleware\CheckAdminAuth;
use App\Http\Middleware\CheckAdminDocAuth;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ServiceController;


/**
 * Public Routes
 * Also need to pass in "AuthCheck" Middleware
 */
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
Route::get('all-doc-list', [ServiceController::class, 'all_doc_list']);
Route::get('all-patients-list', [ServiceController::class, 'all_patients_list']);


/**  Auth Routes  */
Route::group(['middleware' => 'auth:api'], function () {

    /**  User Routes  */
    Route::get('get-user-data', [AuthController::class, 'getUserData']);
    Route::get('logout', [AuthController::class, 'logout']);

    /**  Service Routes  */
    Route::post('schedule-appointment', [ServiceController::class, 'schedule_appointment']);
    Route::get('appointments-list', [ServiceController::class, 'appointments_list']);
    Route::post('reschedule-appointment', [ServiceController::class, 'reschedule_appointment']);
    Route::post('cancel-appointment', [ServiceController::class, 'update_appointment']);


    /**  Only Doc Routes  */
    Route::group(['middleware' => CheckDocAuth::class], function () {
        // 
    });


    /**  Only Admin Routes  */
    Route::group(['middleware' => CheckAdminAuth::class], function () {
        Route::get('pending-authorization-doctors-list', [AdminController::class, 'pending_authorization_doctors_list']);
        Route::post('authorize-doctor', [AdminController::class, 'authorize_doctor']);
    });


    /**  Admin + Doc Routes  */
    Route::group(['middleware' => CheckAdminDocAuth::class], function () {
        Route::get('pending-appointments-list', [ServiceController::class, 'pending_appointments_list']);
        Route::get('appointment-history', [ServiceController::class, 'appointment_history']);
        Route::post('update-appointment', [ServiceController::class, 'update_appointment']);
        Route::post('update-doc-info', [ServiceController::class, 'update_doc_info']);
    });
});
