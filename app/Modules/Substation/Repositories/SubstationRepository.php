<?php

namespace App\Modules\Substation\Repositories;

use App\Modules\Substation\Models\Substation;

class SubstationRepository
{
    public function all()
    {
        return Substation::all();
    }

    public function paginate($perPage = 15)
    {
        return Substation::paginate($perPage);
    }

    public function find($id)
    {
        return Substation::findOrFail($id);
    }

    public function create(array $data)
    {
        return Substation::create($data);
    }

    public function update($id, array $data)
    {
        $model = Substation::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete($id)
    {
        $model = Substation::findOrFail($id);
        return $model->delete();
    }
}