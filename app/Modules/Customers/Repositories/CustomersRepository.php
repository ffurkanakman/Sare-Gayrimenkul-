<?php

namespace App\Modules\Customers\Repositories;

use App\Modules\Customers\Models\Customers;

class CustomersRepository
{
    public function all()
    {
        return Customers::all();
    }

    public function paginate($perPage = 15)
    {
        return Customers::orderBy('id', 'desc')->paginate($perPage);
    }

    public function find($id)
    {
        return Customers::findOrFail($id);
    }

    public function create(array $data)
    {
        return Customers::firstOrCreate(['phone_number' => $data['phone_number']],$data);
    }

    public function update($id, array $data)
    {
        $model = Customers::findOrFail($id);
        $model->update($data);
        return $model;
    }

    public function delete($id)
    {
        $model = Customers::findOrFail($id);
        return $model->delete();
    }
}
