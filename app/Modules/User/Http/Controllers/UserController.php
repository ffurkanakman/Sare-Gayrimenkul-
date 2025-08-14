<?php

namespace App\Modules\User\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\User\Services\UserService;
use App\Modules\User\Http\Requests\UserRequest;
use App\Modules\User\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use App\Traits\HandlesApiExceptions;

class UserController extends Controller
{
    use HandlesApiExceptions;

    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function index(): JsonResponse
    {
        $data = $this->userService->all();
        return $this->successResponse(UserResource::collection($data));
    }


    public function store(UserRequest $request): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($request) {
            $validatedData = $request->validated();
            $user = $this->userService->create($validatedData);
            return $this->createdResponse($user);
        });
    }

    public function show($id): JsonResponse
    {
        $data = $this->userService->find($id);
        return $this->successResponse(new UserResource($data));
    }

    public function update(UserRequest $request, $id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id, $request) {
            $validatedData = $request->validated();
            $user = $this->userService->update($id, $validatedData);
            return $this->updatedResponse($user);
        });
    }

    public function destroy($id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id) {
            $this->userService->delete($id);
        return $this->deletedResponse();
        });
    }
}