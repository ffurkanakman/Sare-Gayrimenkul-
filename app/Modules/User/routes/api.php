<?php

use Illuminate\Support\Facades\Route;
use App\Modules\User\Http\Controllers\UserController;

Route::group([
    'prefix' => 'api/user',
    'as' => 'user',
    //    'middleware' => ['auth:sanctum'],
], static function () {
    Route::get('/', [UserController::class, 'index'])->name('index'); // Listeleme
    Route::post('/', [UserController::class, 'store'])->name('store'); // Ekleme
    Route::get('/{id}', [UserController::class, 'show'])->name('show'); // Tekil veri getir
    Route::put('/{id}', [UserController::class, 'update'])->name('update'); // Güncelleme
    Route::delete('/{id}', [UserController::class, 'destroy'])->name('destroy'); // Silme
    Route::get('/{id}/customers', [UserController::class, 'getCustomers'])->name('get-customers'); // Kullanıcının müşterilerini getir
});
