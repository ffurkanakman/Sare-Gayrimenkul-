<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Customers\Http\Controllers\CustomersController;

Route::group([
    'prefix' => 'api/customers',
    'as' => 'customers',
    //    'middleware' => ['auth:sanctum'],
], static function () {
    Route::get('/', [CustomersController::class, 'index'])->name('index'); // Listeleme
    Route::post('/', [CustomersController::class, 'store'])->name('store'); // Ekleme
    Route::get('/statuses', [CustomersController::class, 'statuses'])->name('statuses'); // Durum listesi
    Route::get('/{id}', [CustomersController::class, 'show'])->name('show'); // Tekil veri getir
    Route::put('/{id}', [CustomersController::class, 'update'])->name('update'); // Güncelleme
    Route::put('/status/{id}', [CustomersController::class, 'update_status'])->name('update_status'); // Güncelleme
    Route::delete('/{id}', [CustomersController::class, 'destroy'])->name('destroy'); // Silme

    // SMS message endpoints
    Route::post('/message/{id}', [CustomersController::class, 'sendMessage'])->name('send_message'); // Mesaj gönder
    Route::get('/message-status/{id}', [CustomersController::class, 'checkMessageStatus'])->name('check_message_status'); // Mesaj durumu kontrol
});
