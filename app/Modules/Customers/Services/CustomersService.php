<?php

namespace App\Modules\Customers\Services;

use App\Modules\Customers\Repositories\CustomersRepository;
use Illuminate\Support\Facades\Auth;

class CustomersService
{
    protected $customersRepository;

    public function __construct(CustomersRepository $customersRepository)
    {
        $this->customersRepository = $customersRepository;
    }

    public function all()
    {
        return $this->customersRepository->paginate();
    }

    public function create(array $data)
    {
        // İstekten auto_assign bayrağını oku (varsayılan: false)
        $autoAssign = request()->boolean('auto_assign', false);

        // Aktif kullanıcı ID'sini guard bağımsız çöz
        $managerId = $this->resolveAuthId();

        if (!$autoAssign && $managerId) {
            // Manuel kayıt: oluşturan kullanıcıyı yetkili yap
            $data['manager_id'] = $managerId;
        } else {
            // Guard'dan ID alamazsak veya auto_assign istenmişse
            // -> manager_id'yi boş bırak + model algoritması çalışsın
            unset($data['manager_id']);
            // Model boot() içindeki kontrol request('auto_assign') baktığı için bayrağı set ediyoruz
            request()->merge(['auto_assign' => true]);
        }

        return $this->customersRepository->create($data);
    }

    public function find($id)
    {
        return $this->customersRepository->find($id);
    }

    public function update($id, array $data)
    {
        // Dışarıdan manager değişikliğine izin vermiyorsak güvenlik için ignore edelim
        if (array_key_exists('manager_id', $data)) {
            unset($data['manager_id']);
        }

        return $this->customersRepository->update($id, $data);
    }

    public function delete($id)
    {
        return $this->customersRepository->delete($id);
    }

    /**
     * Mevcut konfigüre edilmiş guard'lar arasından oturum açmış ilk kullanıcıyı bulur.
     * Tanımlı olmayan guard çağrısı yapmadığı için "Auth guard [X] is not defined" hatası olmaz.
     */
    private function resolveAuthId(): ?int
    {
        // Önce default guard
        if (Auth::check()) {
            return Auth::id();
        }

        // Konfigüre edilmiş tüm guard'ları sırayla dene
        $guards = array_keys(config('auth.guards', []));
        foreach ($guards as $guard) {
            try {
                if (Auth::guard($guard)->check()) {
                    return Auth::guard($guard)->id();
                }
            } catch (\Throwable $e) {
                // herhangi bir guard problemi olursa yut
            }
        }

        // Son çare: request()->user()
        return request()->user()?->id;
    }
}
