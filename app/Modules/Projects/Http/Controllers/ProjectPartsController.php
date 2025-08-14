<?php

namespace App\Modules\Projects\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Projects\Models\ProjectPart;
use Illuminate\Http\JsonResponse;

class ProjectPartsController extends Controller
{
    public function index(): JsonResponse
    {
        \Log::info("🔥 project_parts controller çalıştı");

        $parts = ProjectPart::all();

        return response()->json([
            'data' => $parts
        ]);
    }
}
