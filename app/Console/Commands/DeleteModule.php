<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Symfony\Component\Process\Process;

class DeleteModule extends Command
{
    protected $signature = 'module:delete {module}';
    protected $description = 'Deletes an existing module with all related files and directories';

    public function handle()
    {
        $module = Str::ucfirst($this->argument('module'));
        $modulePath = app_path("Modules/$module");

        if (!File::exists($modulePath)) {
            $this->error("Modül bulunamadı: $module");
            return;
        }

        // Modül klasörünü tamamen sil
        File::deleteDirectory($modulePath);
        $this->info("Modül silindi: $module");

        // AppServiceProvider'dan ilgili ServiceProvider'ı kaldır
        $this->removeServiceProviderFromApp($module);

        // Autoload güncelle
        $this->runComposerDumpAutoload();
    }

    protected function removeServiceProviderFromApp($module)
    {
        $appServiceProviderPath = app_path('Providers/AppServiceProvider.php');

        if (!File::exists($appServiceProviderPath)) {
            return;
        }

        $appServiceProviderContent = File::get($appServiceProviderPath);
        $serviceProvider = "        \$this->app->register({$module}ServiceProvider::class);";
        $useNamespace = "use App\\Modules\\$module\\Providers\\{$module}ServiceProvider;";

        // ServiceProvider çağrısını kaldır
        $appServiceProviderContent = str_replace($serviceProvider, '', $appServiceProviderContent);
        $appServiceProviderContent = str_replace($useNamespace, '', $appServiceProviderContent);

        // Gereksiz boşlukları temizle
        $appServiceProviderContent = preg_replace("/\n{2,}/", "\n", $appServiceProviderContent);

        File::put($appServiceProviderPath, $appServiceProviderContent);
        $this->info("AppServiceProvider temizlendi ve güncellendi!");
    }

    protected function runComposerDumpAutoload()
    {
        $process = new Process(['composer', 'dump-autoload']);
        $process->setTimeout(120);  // Timeout süresini 120 saniyeye çıkarıyoruz.
        $process->run();

        if ($process->isSuccessful()) {
            $this->info("Autoload güncellendi.");
        } else {
            $this->error("Autoload güncellenirken hata oluştu.");
        }
    }

}
