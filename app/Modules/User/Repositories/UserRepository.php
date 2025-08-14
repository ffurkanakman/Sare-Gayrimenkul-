<?php

namespace App\Modules\User\Repositories;

use App\Modules\User\Models\User;

class UserRepository
{
    public function all()
    {
        return User::all();
    }

    public function paginate($perPage = 15)
    {
        return User::paginate($perPage);
    }

    public function find($id)
    {
        return User::findOrFail($id);
    }

    public function create(array $data)
    {
        return User::create($data);
    }

    public function update($id, array $data)
    {
        $model = User::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete($id)
    {
        $model = User::findOrFail($id);
        return $model->delete();
    }
}