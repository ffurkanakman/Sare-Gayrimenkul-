<?php

namespace App\Modules\User\Providers;

use Illuminate\Support\ServiceProvider;

class UserServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Bind your services here
    }

    public function boot()
    {
        // Config dosyasını yükle
        $this->mergeConfigFrom(
            app_path("Modules/User/config.php"), "UserModule"
        );

        // Eğer active config değeri false ise, rotaları yüklemiyoruz
        if (config("UserModule.active") === true) {
            // Rotaları yükle
            $this->loadMigrationsFrom(app_path("Modules/User/database/migrations"));

            if (file_exists($routesPath = app_path("Modules/User/routes/api.php"))) {
                $this->loadRoutesFrom($routesPath);
            }
        }
    }
}