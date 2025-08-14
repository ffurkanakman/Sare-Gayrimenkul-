<?php

use Illuminate\Support\Facades\Route;

Route::view('/{any}', 'app')->where('any', '.*');
// İstersen ana sayfayı da aynı görünüme bağla:
Route::view('/', 'app');
