<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class MediaService
{
    private ImageManager $imageManager;

    public function __construct()
    {
        $this->imageManager = new ImageManager(new Driver());
    }

    /**
     * Verilen bir dosyayı yükler ve işler.
     *
     * @param UploadedFile $file Yüklenecek dosya.
     * @param string $name Dosya için kullanılacak isim.
     * @param string $directory Dosyanın yükleneceği dizin.
     * @param int $quality Resim kalitesi.
     * @param string $disk Kullanılacak disk (storage).
     * @return string Yüklenen dosyanın yolu.
     */
    public function upload(
        UploadedFile $file,
        string       $name,
        string       $directory = 'uploads',
        int          $quality = 90,
        string       $disk = 'public'
    ): string
    {
        // Benzersiz dosya adı oluştur
        $fileName = Str::slug($name) . '-' . uniqid() . '.webp';
        $path =  $directory . '/' . $fileName;

        // Resmi işle
        $image = $this->imageManager->read($file)->toWebp($quality);

        // Storage'a kaydet
        Storage::disk($disk)->put($path, $image);

        return '/storage/' . $path;
    }


    /**
     * Uzak bir URL'den resmi indirir ve kaydeder.
     *
     * @param string $url Resmin URL'i
     * @param string $name Kaydedilecek dosya adı
     * @param string $directory Kaydedilecek dizin
     * @param int $quality Resim kalitesi
     * @param string $disk Kullanılacak disk
     * @return string Kaydedilen dosyanın yolu
     */
    public function downloadAndSave(
        string $url,
        string $name,
        string $directory = 'uploads',
        int $quality = 90,
        string $disk = 'public'
    ): string {
        // Benzersiz dosya adı oluştur
        $fileName = Str::slug($name) . '-' . uniqid() . '.webp';
        $path = $directory . '/' . $fileName;

        // URL'den resmi oku
        $image = $this->imageManager->read(file_get_contents($url))->toWebp($quality);

        // Storage'a kaydet
        Storage::disk($disk)->put($path, $image);

        return '/storage/' . $path;
    }

    /**
     * Verilen bir dosyayı siler.
     *
     * @param string $path Silinecek dosyanın yolu.
     * @param string $disk Kullanılacak disk (storage).
     * @return bool Dosyanın başarılı bir şekilde silinip silinmediği.
     */
    public function delete(string $path, string $disk = 'public'): bool
    {
        if (Storage::disk($disk)->exists($path)) {
            return Storage::disk($disk)->delete($path);
        }

        return false;
    }

    /**
     * Verilen bir resmi yeniden boyutlandırır ve yükler.
     *
     * @param UploadedFile $file Yüklenecek ve boyutlandırılacak dosya.
     * @param int $width Yeni genişlik.
     * @param int $height Yeni yükseklik.
     * @param string $name Dosya için kullanılacak isim.
     * @param string $directory Dosyanın yükleneceği dizin.
     * @param int $quality Resim kalitesi.
     * @param string $disk Kullanılacak disk (storage).
     * @return string Boyutlandırılmış dosyanın yolu.
     */
    public function resize(
        UploadedFile $file,
        int          $width,
        int          $height,
        string       $name,
        string       $directory = 'uploads',
        int          $quality = 90,
        string       $disk = 'public'
    ): string
    {
        // Benzersiz dosya adı oluştur
        $fileName = Str::slug($name) . '-' . uniqid() . '.webp';
        $path = $directory . '/' . $fileName;

        // Resmi işle ve boyutlandır
        $image = $this->imageManager->read($file)
            ->resize($width, $height)
            ->toWebp($quality);

        // Storage'a kaydet
        Storage::disk($disk)->put($path, $image);

        return '/storage/'.$path;
    }
}
