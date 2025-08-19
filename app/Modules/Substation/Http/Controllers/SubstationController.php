<?php

namespace App\Modules\Substation\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Substation\Services\SubstationService;
use App\Modules\Substation\Http\Requests\SubstationRequest;
use App\Modules\Substation\Http\Resources\SubstationResource;
use Illuminate\Http\JsonResponse;
use App\Traits\HandlesApiExceptions;

class SubstationController extends Controller
{
    use HandlesApiExceptions;

    protected $substationService;

    public function __construct(SubstationService $substationService)
    {
        $this->substationService = $substationService;
    }

    public function index(): JsonResponse
    {
        $data = $this->substationService->all();
        return $this->successResponse(SubstationResource::collection($data));
    }


    public function store(SubstationRequest $request): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($request) {
            $validatedData = $request->validated();
            $substation = $this->substationService->create($validatedData);
            return $this->createdResponse($substation);
        });
    }

    public function show($id): JsonResponse
    {
        $data = $this->substationService->find($id);
        return $this->successResponse(new SubstationResource($data));
    }

    public function update(SubstationRequest $request, $id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id, $request) {
            $validatedData = $request->validated();
            $substation = $this->substationService->update($id, $validatedData);
            return $this->updatedResponse($substation);
        });
    }

    public function destroy($id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id) {
            $this->substationService->delete($id);
        return $this->deletedResponse();
        });
    }
}
