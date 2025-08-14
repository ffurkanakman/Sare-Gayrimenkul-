<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Projects\Http\Controllers\ProjectController;
use App\Modules\Projects\Http\Controllers\ProjectPartsController;


Route::group([
    'prefix' => 'api/projects',
    'as' => 'projects.',
//    'middleware' => ['auth:sanctum'], // Uncommented to use Sanctum for authentication
], static function () {
    Route::get('/', [ProjectController::class, 'index'])->name('index');          // List all projects
    Route::post('/', [ProjectController::class, 'store'])->name('store');         // Create a new project

    Route::get('/parts', [ProjectPartsController::class, 'index'])->name('parts.index');

    Route::get('/{id}', [ProjectController::class, 'show'])->name('show');        // Show a specific project
    Route::put('/{id}', [ProjectController::class, 'update'])->name('update');    // Update a project
    Route::delete('/{id}', [ProjectController::class, 'destroy'])->name('destroy'); // Delete a project

    // Additional routes for project approval/rejection
    Route::put('/{id}/approve', [ProjectController::class, 'approve'])->name('approve'); // Approve a project
    Route::put('/{id}/reject', [ProjectController::class, 'reject'])->name('reject');   // Reject a project


});
