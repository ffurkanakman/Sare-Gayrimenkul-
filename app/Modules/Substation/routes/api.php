<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Substation\Http\Controllers\SubstationController;

Route::group([
    'prefix' => 'api/substation',
    'as' => 'substation',
    //    'middleware' => ['auth:sanctum'],
], static function () {
    Route::get('/', [SubstationController::class, 'index'])->name('index'); // Listeleme
    Route::post('/', [SubstationController::class, 'store'])->name('store'); // Ekleme
    Route::get('/{id}', [SubstationController::class, 'show'])->name('show'); // Tekil veri getir
    Route::put('/{id}', [SubstationController::class, 'update'])->name('update'); // Güncelleme
    Route::delete('/{id}', [SubstationController::class, 'destroy'])->name('destroy'); // Silme
});