<?php

namespace App\Modules\Projects\Providers;

use Illuminate\Support\ServiceProvider;

class ProjectsServiceProvider extends ServiceProvider
{
    public function register()
    {
        // Register any bindings or services here
    }

    public function boot()
    {
        // Load config file
        $this->mergeConfigFrom(
            app_path("Modules/Projects/config.php"), "ProjectsModule"
        );

        $this->loadRoutesFrom(__DIR__.'/../routes/api.php');

        // Only load routes and migrations if the module is active
        if (config("ProjectsModule.active") === true) {
            // Load migrations
            $this->loadMigrationsFrom(app_path("Modules/Projects/database/migrations"));

            // Load routes
            if (file_exists($routesPath = app_path("Modules/Projects/routes/api.php"))) {
                $this->loadRoutesFrom($routesPath);
            }
        }
    }
}
