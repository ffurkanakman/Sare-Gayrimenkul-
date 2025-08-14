<?php

namespace App\Modules\Projects\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Projects\Services\ProjectService;
use App\Modules\Projects\Http\Requests\ProjectRequest;
use App\Modules\Projects\Http\Resources\ProjectResource;
use Illuminate\Http\JsonResponse;
use App\Traits\HandlesApiExceptions;

class ProjectController extends Controller
{
    use HandlesApiExceptions;

    protected $projectService;

    public function __construct(ProjectService $projectService)
    {
        $this->projectService = $projectService;
    }

    public function index(): JsonResponse
    {
        return $this->handleApiExceptions(function () {
            $data = $this->projectService->all();
            return $this->successResponse(ProjectResource::collection($data));
        });
    }

    public function store(ProjectRequest $request): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($request) {
            $validatedData = $request->validated();
            $project = $this->projectService->create($validatedData);
            return $this->createdResponse(new ProjectResource($project));
        });
    }

    public function show($id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id) {
            $data = $this->projectService->find($id);
            return $this->successResponse(new ProjectResource($data));
        });
    }

    public function update(ProjectRequest $request, $id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id, $request) {
            $validatedData = $request->validated();
            $project = $this->projectService->update($id, $validatedData);
            return $this->updatedResponse(new ProjectResource($project));
        });
    }

    public function destroy($id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id) {
            $this->projectService->delete($id);
            return $this->deletedResponse();
        });
    }

    public function approve($id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id) {
            $project = $this->projectService->approve($id);
            return $this->updatedResponse(new ProjectResource($project));
        });
    }

    public function reject($id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id) {
            $project = $this->projectService->reject($id);
            return $this->updatedResponse(new ProjectResource($project));
        });
    }
}
