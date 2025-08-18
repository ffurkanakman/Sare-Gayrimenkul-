<?php

// App/Modules/User/Services/UserService.php
namespace App\Modules\User\Services;

use App\Modules\User\Repositories\UserRepository;
use App\Services\MediaService;

class UserService
{
    protected $userRepository;
    protected MediaService $media;

    public function __construct(UserRepository $userRepository, MediaService $media)
    {
        $this->userRepository = $userRepository;
        $this->media = $media;
    }

    public function all()
    {
        return $this->userRepository->all();
    }

    public function create(array $data)
    {
        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }

        // 👇 resim varsa MediaService ile yükle → URL dönüyor (/storage/avatars/xxx.webp)
        if (isset($data['pic']) && $data['pic'] instanceof \Illuminate\Http\UploadedFile) {
            $data['pic'] = $this->media->upload(
                file: $data['pic'],
                name: trim(($data['name'] ?? '').' '.($data['surname'] ?? '')),
                directory: 'avatars',
                quality: 90,
                disk: 'public'
            );
        }

        return $this->userRepository->create($data);
    }

    public function find($id)
    {
        return $this->userRepository->find($id);
    }

    public function update($id, array $data)
    {
        $user = $this->userRepository->find($id);

        if (array_key_exists('password', $data)) {
            if ($data['password']) {
                $data['password'] = bcrypt($data['password']);
            } else {
                unset($data['password']);
            }
        }

        // 👇 avatar silme
        if (!empty($data['remove_pic'])) {
            $this->deleteIfExists($user->pic);
            $data['pic'] = null;
        }

        // 👇 yeni resim yüklendiyse: eskisini sil → yeniyi yükle
        if (isset($data['pic']) && $data['pic'] instanceof \Illuminate\Http\UploadedFile) {
            $this->deleteIfExists($user->pic);
            $data['pic'] = $this->media->upload(
                file: $data['pic'],
                name: trim(($data['name'] ?? $user->name).' '.($data['surname'] ?? $user->surname)),
                directory: 'avatars',
                quality: 90,
                disk: 'public'
            );
        }

        return $this->userRepository->update($id, $data);
    }

    public function delete($id)
    {
        $user = $this->userRepository->find($id);
        $this->deleteIfExists($user->pic);
        return $this->userRepository->delete($id);
    }

    // ===== helpers =====

    /**
     * MediaService.delete disk-relative path bekliyor.
     * DB’de URL (/storage/avatars/xxx.webp) var → 'avatars/xxx.webp' yapıp gönderiyoruz.
     */
    private function deleteIfExists(?string $storedUrl): void
    {
        $path = $this->toDiskPath($storedUrl); // avatars/xxx.webp
        if ($path) {
            $this->media->delete($path, 'public');
        }
    }

    private function toDiskPath(?string $url): ?string
    {
        if (!$url) return null;
        // /storage/avatars/..  → avatars/..
        return ltrim(preg_replace('#^/storage/#', '', $url), '/');
    }
}
