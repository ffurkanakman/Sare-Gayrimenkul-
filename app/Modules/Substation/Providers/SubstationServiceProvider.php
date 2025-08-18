<?php

namespace App\Modules\Substation\Providers;

use Illuminate\Support\ServiceProvider;

class SubstationServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Bind your services here
    }

    public function boot()
    {
        // Config dosyasını yükle
        $this->mergeConfigFrom(
            app_path("Modules/Substation/config.php"), "SubstationModule"
        );

        // Eğer active config değeri false ise, rotaları yüklemiyoruz
        if (config("SubstationModule.active") === true) {
            // Rotaları yükle
            $this->loadMigrationsFrom(app_path("Modules/Substation/database/migrations"));

            if (file_exists($routesPath = app_path("Modules/Substation/routes/api.php"))) {
                $this->loadRoutesFrom($routesPath);
            }
        }
    }
}