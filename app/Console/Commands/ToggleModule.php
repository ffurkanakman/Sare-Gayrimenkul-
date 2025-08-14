<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Artisan;

class ToggleModule extends Command
{
    protected $signature = 'module:toggle {module}';
    protected $description = 'Belirtilen modülü aktif/pasif yapar';

    public function handle()
    {
        $module = $this->argument('module');
        $modulePath = base_path("app/Modules/{$module}");
        $configPath = "{$modulePath}/config.php";

        if (!File::exists($configPath)) {
            $this->error("Modül bulunamadı: {$module}");
            return;
        }

        // Mevcut durumu oku
        $config = require $configPath;
        $currentStatus = $config['active'] ?? true;
        $statusText = $currentStatus ? '🟢 Aktif' : '🔴 Pasif';

        // Kullanıcıya durumu göster ve seçenekleri sor
        $this->info("Modül şu an: {$statusText}");
        $choice = $this->choice(
            'Ne yapmak istiyorsun?',
            ['Aktif yap', 'Pasif yap', 'Vazgeç'],
            2 // Varsayılan olarak 'Vazgeç' seçili
        );

        // Kullanıcının seçimine göre aksiyon al
        if ($choice === 'Vazgeç') {
            $this->warn("İşlem iptal edildi.");
            return;
        }

        $newStatus = $choice === 'Aktif yap';
        $config['active'] = $newStatus;

        // Yeni içeriği oluştur
        $configContent = "<?php\n\nreturn " . var_export($config, true) . ";\n";
        File::put($configPath, $configContent);

        // Config cache temizle
        Artisan::call('config:clear');

        // Sonucu bildir
        $newStatusText = $newStatus ? '🟢 Aktif' : '🔴 Pasif';
        $this->info("Modül durumu değiştirildi: {$newStatusText}");
    }
}
