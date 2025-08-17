<?php

namespace App\Modules\Customers\Providers;

use Illuminate\Support\ServiceProvider;

class CustomersServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Bind your services here
    }

    public function boot()
    {
        // Config dosyasını yükle
        $this->mergeConfigFrom(
            app_path("Modules/Customers/config.php"), "CustomersModule"
        );

        // Eğer active config değeri false ise, rotaları yüklemiyoruz
        if (config("CustomersModule.active") === true) {
            // Rotaları yükle
            $this->loadMigrationsFrom(app_path("Modules/Customers/database/migrations"));

            if (file_exists($routesPath = app_path("Modules/Customers/routes/api.php"))) {
                $this->loadRoutesFrom($routesPath);
            }
        }
    }
}