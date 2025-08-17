<?php

namespace App\Providers;
use App\Modules\Customers\Providers\CustomersServiceProvider;

use App\Modules\User\Providers\UserServiceProvider;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
    // Register services
        $this->app->register(CustomersServiceProvider::class);
        // Register services
        $this->app->register(UserServiceProvider::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);
        Vite::prefetch(concurrency: 3);
    }
}
