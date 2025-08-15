<?php

namespace App\Traits;

use Illuminate\Support\Facades\Log;
use Exception;

trait Loggable
{
    /**
     * Genel bir log fonksiyonu.
     * Her modül için dinamik bir kanal belirler ve loglama yapar.
     *
     * @param string $message Log mesajı.
     * @param string $level Log seviyesini belirtir (info, debug, error, vb.).
     * @param array $context Ek bilgi olarak kullanılacak bağlam verisi.
     * @return void
     * @throws Exception Log yazımı sırasında hata oluşursa fırlatılır.
     */
    public function log(string $message, string $level = 'info', array $context = []): void
    {
        try {
            // Modül adı için dinamik bir kanal belirle
            $channel = $context['module'] ?? 'genel';

            // Geçerli log seviyelerini kontrol et
            $allowedLevels = [
                'debug', 'info', 'notice', 'warning', 'error',
                'critical', 'alert', 'emergency'
            ];

            if (!in_array(strtolower($level), $allowedLevels)) {
                $level = 'info'; // Geçersiz seviyede varsayılan olarak 'info' kullanılır
            }

            // Log dosyasının yolu
            $logPath = storage_path('logs/' . strtolower($channel) . '.log');

            // Log oluşturucu yapılandırması
            $logger = Log::build([
                'driver' => 'single',
                'path' => $logPath,
                'level' => $level,
            ]);

            // 'data' işleme: Eğer array veya object ise JSON'a çevir
            if (isset($context['data'])) {
                if (is_array($context['data']) || is_object($context['data'])) {
                    // JSON encode işlemi, hatalı array to string conversion'ı engeller
                    $context['data'] = json_encode($context['data'], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
                }
            }

            // Eğer 'data' yoksa context'e null değeri ekliyoruz
            if (!isset($context['data'])) {
                $context['data'] = null;
            }

            // Log kaydını oluştur
            $logger->log($level, $message, $context);

            // Eğer "status_code" varsa, ek bir bilgi olarak logla
            if (isset($context['status_code'])) {
                $logger->info("Status Code: " . $context['status_code']);
            }

        } catch (Exception $e) {
            // Hata durumunda bir istisna fırlat
            throw new Exception("Log yazılırken bir hata oluştu: " . $e->getMessage());
        }
    }

    /**
     * Modül adı dinamik olarak belirlenir.
     */
    protected function getLogChannel(): string
    {
        // Sınıf adından modül ismini çıkar
        $className = static::class;
        $parts = explode('\\', $className);
        $module = $parts[2] ?? 'general'; // Modül klasöründeki 2. eleman

        return strtolower($module); // Örnek: "Auth", "Company"
    }

    /**
     * Bilgi logu.
     */
    protected function logInfo(string $message, array $context = []): void
    {
        Log::channel($this->getLogChannel())->info($this->formatLogMessage($message), $context);
    }

    /**
     * Hata logu.
     */
    protected function logError(string $message, array $context = []): void
    {
        Log::channel($this->getLogChannel())->error($this->formatLogMessage($message), $context);
    }

    /**
     * Uyarı logu.
     */
    protected function logWarning(string $message, array $context = []): void
    {
        Log::channel($this->getLogChannel())->warning($this->formatLogMessage($message), $context);
    }

    /**
     * Log mesaj formatı.
     */
    private function formatLogMessage(string $message): string
    {
        return sprintf('[%s] %s: %s', class_basename($this), now()->toDateTimeString(), $message);
    }
}
