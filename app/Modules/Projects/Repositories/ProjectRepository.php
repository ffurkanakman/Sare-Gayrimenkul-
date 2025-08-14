<?php

namespace App\Modules\Projects\Repositories;

use App\Modules\Projects\Models\Project;

class ProjectRepository
{
    public function all()
    {
        return Project::orderByDesc('created_at')->get();
    }

    public function paginate($perPage = 15)
    {
        return Project::orderByDesc('created_at')->paginate($perPage);
    }

    public function find($id)
    {
        return Project::findOrFail($id);
    }

    public function create(array $data)
    {
        return Project::create($data);
    }

    public function firstOrCreate(array $search, array $data = [])
    {
        return Project::firstOrCreate($search, $data);
    }

    public function updateOrCreate(array $search, array $data)
    {
        return Project::updateOrCreate($search, $data);
    }

    public function update($id, array $data)
    {
        $project = $this->find($id);
        $project->update($data);
        return $project;
    }

    public function delete($id)
    {
        $project = $this->find($id);
        return $project->delete();
    }

    public function updateStatus($id, string $status)
    {
        $project = $this->find($id);
        $project->update(['status' => $status]);
        return $project;
    }
}
