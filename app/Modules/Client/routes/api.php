<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Client\Http\Controllers\ClientController;

Route::group([
    'prefix' => 'api/client',
    'as' => 'client',
    //    'middleware' => ['auth:sanctum'],
], static function () {
    Route::get('/', [ClientController::class, 'index'])->name('index'); // Listeleme
    Route::post('/', [ClientController::class, 'store'])->name('store'); // Ekleme
    Route::get('/{id}', [ClientController::class, 'show'])->name('show'); // Tekil veri getir
    Route::put('/{id}', [ClientController::class, 'update'])->name('update'); // Güncelleme
    Route::delete('/{id}', [ClientController::class, 'destroy'])->name('destroy'); // Silme
});