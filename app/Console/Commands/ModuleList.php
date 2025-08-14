<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class ModuleList extends Command
{
    protected $signature = 'module:list';
    protected $description = 'Tüm modülleri ve durumlarını listeler';

    public function handle()
    {
        $modulesPath = app_path('Modules');

        if (!File::exists($modulesPath)) {
            $this->warn("Modules klasörü bulunamadı!");
            return;
        }

        $modules = collect(File::glob("$modulesPath/*", GLOB_ONLYDIR))
            ->map(function ($path) {
                $module = basename($path);
                $configPath = "$path/config.php";

                $status = '⚪ Config Yok';
                if (File::exists($configPath)) {
                    $config = include $configPath;
                    $status = ($config['active'] ?? false) ? '🟢 Aktif' : '🔴 Pasif';
                }

                return ['name' => $module, 'status' => $status];
            });

        if ($modules->isEmpty()) {
            $this->warn("Hiç modül bulunamadı.");
            return;
        }

        $this->table(['Modül Adı', 'Durum'], $modules);
    }
}
