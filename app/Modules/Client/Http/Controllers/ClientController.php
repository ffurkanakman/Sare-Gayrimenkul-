<?php

namespace App\Modules\Client\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Client\Services\ClientService;
use App\Modules\Client\Http\Requests\ClientRequest;
use App\Modules\Client\Http\Resources\ClientResource;
use Illuminate\Http\JsonResponse;
use App\Traits\HandlesApiExceptions;

class ClientController extends Controller
{
    use HandlesApiExceptions;

    protected $clientService;

    public function __construct(ClientService $clientService)
    {
        $this->clientService = $clientService;
    }

    public function index(): JsonResponse
    {
        $data = $this->clientService->all();
        return $this->successResponse(ClientResource::collection($data));
    }


    public function store(ClientRequest $request): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($request) {
            $validatedData = $request->validated();
            $client = $this->clientService->create($validatedData);
            return $this->createdResponse($client);
        });
    }

    public function show($id): JsonResponse
    {
        $data = $this->clientService->find($id);
        return $this->successResponse(new ClientResource($data));
    }

    public function update(ClientRequest $request, $id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id, $request) {
            $validatedData = $request->validated();
            $client = $this->clientService->update($id, $validatedData);
            return $this->updatedResponse($client);
        });
    }

    public function destroy($id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id) {
            $this->clientService->delete($id);
        return $this->deletedResponse();
        });
    }
}