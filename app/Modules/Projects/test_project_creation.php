<?php

require_once __DIR__ . '/../../../vendor/autoload.php';

// Bootstrap Laravel
$app = require_once __DIR__ . '/../../../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

// Use the ProjectService to create a new project
$projectService = app(\App\Modules\Projects\Services\ProjectService::class);

// Project data
$projectData = [
    'name' => 'PRJ-' . rand(1000, 9999),
    'description' => 'Test project created with firstOrCreate',
    'company_name' => 'Test Company',
    'authorized_person' => 'Test Person',
    'machine_info' => 'Test Machine',
    'project_type' => 'Test',
    'price' => 1000.00,
    'notes' => 'Test notes',
    'done_jobs' => 'Test done jobs',
];

// Search criteria for firstOrCreate
$searchCriteria = [
    'company_name' => 'Test Company',
    'machine_info' => 'Test Machine',
];

try {
    // Create the project using the service's create method (which uses firstOrCreate internally)
    $project = $projectService->create($projectData);

    echo "Project created successfully!\n";
    echo "ID: " . $project->id . "\n";
    echo "Name: " . $project->name . "\n";
    echo "Company: " . $project->company_name . "\n";
    echo "Machine: " . $project->machine_info . "\n";

    // Try to create the same project again - should return the existing one
    $duplicateProject = $projectService->create($projectData);

    echo "\nAttempted to create duplicate project:\n";
    echo "ID: " . $duplicateProject->id . "\n";
    echo "Name: " . $duplicateProject->name . "\n";

    if ($project->id === $duplicateProject->id) {
        echo "\nSuccess! firstOrCreate returned the existing project instead of creating a duplicate.\n";
    } else {
        echo "\nError: A duplicate project was created.\n";
    }

} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
