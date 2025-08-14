<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::prefix('v1')->group(function () {

    Route::post('Giris', [AuthController::class, 'login'])->name('login');
    Route::post('KayitOl', [AuthController::class, 'register'])->name('register');

    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('reset-password-token', [AuthController::class, 'resetPasswordWithToken'])->name('password.reset.token');

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('Cikis', [AuthController::class, 'logout'])->name('logout');
        Route::get('me', fn () => response()->json(auth()->user()))->name('me');
        Route::put('reset-password', [AuthController::class, 'resetPassword'])->name('password.reset');
        Route::post('TokenYenile', [AuthController::class, 'refreshToken'])->name('token.refresh');
    });
});

