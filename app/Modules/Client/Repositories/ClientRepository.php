<?php

namespace App\Modules\Client\Repositories;

use App\Modules\Client\Models\Client;

class ClientRepository
{
    public function all()
    {
        return Client::all();
    }

    public function paginate($perPage = 15)
    {
        return Client::paginate($perPage);
    }

    public function find($id)
    {
        return Client::findOrFail($id);
    }

    public function create(array $data)
    {
        return Client::create($data);
    }

    public function update($id, array $data)
    {
        $model = Client::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete($id)
    {
        $model = Client::findOrFail($id);
        return $model->delete();
    }
}