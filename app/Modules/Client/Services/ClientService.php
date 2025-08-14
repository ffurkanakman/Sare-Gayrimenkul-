<?php

namespace App\Modules\Client\Services;

use App\Modules\Client\Repositories\ClientRepository;

class ClientService
{
    protected $clientRepository;

    public function __construct(ClientRepository $clientRepository)
    {
        $this->clientRepository = $clientRepository;
    }

    public function all()
    {
        return $this->clientRepository->all();
    }

    public function create(array $data)
    {
        return $this->clientRepository->create($data);
    }

    public function find($id)
    {
        return $this->clientRepository->find($id);
    }

    public function update($id, array $data)
    {
        return $this->clientRepository->update($id, $data);
    }

    public function delete($id)
    {
        return $this->clientRepository->delete($id);
    }
}