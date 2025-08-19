<?php

namespace App\Modules\Substation\Services;

use App\Modules\Substation\Repositories\SubstationRepository;

class SubstationService
{
    protected $substationRepository;

    public function __construct(SubstationRepository $substationRepository)
    {
        $this->substationRepository = $substationRepository;
    }

    public function all()
    {
        return $this->substationRepository->all();
    }

    public function create(array $data)
    {
        // Dosya yükleme varsa işle
        if (isset($data['cover_image']) && $data['cover_image'] instanceof \Illuminate\Http\UploadedFile) {
            $path = $data['cover_image']->store('substations', 'public');
            $data['cover_image'] = $path;
        }

        return $this->substationRepository->create($data);
    }

    public function find($id)
    {
        return $this->substationRepository->find($id);
    }


    public function update($id, array $data)
    {
        if (isset($data['cover_image']) && $data['cover_image'] instanceof \Illuminate\Http\UploadedFile) {
            $path = $data['cover_image']->store('substations', 'public');
            $data['cover_image'] = $path;
        }

        return $this->substationRepository->update($id, $data);
    }

    public function delete($id)
    {
        return $this->substationRepository->delete($id);
    }
}
