<?php

namespace App\Modules\Client\Providers;

use Illuminate\Support\ServiceProvider;

class ClientServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Bind your services here
    }

    public function boot()
    {
        // Config dosyasını yükle
        $this->mergeConfigFrom(
            app_path("Modules/Client/config.php"), "ClientModule"
        );

        // Eğer active config değeri false ise, rotaları yüklemiyoruz
        if (config("ClientModule.active") === true) {
            // Rotaları yükle
            $this->loadMigrationsFrom(app_path("Modules/Client/database/migrations"));

            if (file_exists($routesPath = app_path("Modules/Client/routes/api.php"))) {
                $this->loadRoutesFrom($routesPath);
            }
        }
    }
}