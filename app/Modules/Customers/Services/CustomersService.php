<?php

namespace App\Modules\Customers\Services;

use App\Modules\Customers\Repositories\CustomersRepository;

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
        return $this->customersRepository->create($data);
    }

    public function find($id)
    {
        return $this->customersRepository->find($id);
    }

    public function update($id, array $data)
    {
        return $this->customersRepository->update($id, $data);
    }

    public function delete($id)
    {
        return $this->customersRepository->delete($id);
    }
}
