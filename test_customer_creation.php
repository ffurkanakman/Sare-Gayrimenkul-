<?php

// Bootstrap the Laravel application
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Modules\Customers\Models\Customers;
use App\Modules\User\Models\User;

// Display current user performance coefficients
echo "Current user performance coefficients:\n";
$users = User::select('id', 'name', 'performance_coefficient')->get();
foreach ($users as $user) {
    echo "User {$user->id} ({$user->name}): {$user->performance_coefficient}\n";
}

// Create a test customer
$customer = new Customers([
    'name' => 'Test Customer ' . date('Y-m-d H:i:s'),
    'phone_number' => '(555) 123 45 67',
    'status' => 'pending',
    'description' => 'Test customer created to verify the algorithm'
]);

$customer->save();

// Check which user was assigned
$assignedUser = User::find($customer->manager_id);

echo "\nTest customer created with ID: {$customer->id}\n";
echo "Assigned to user: {$assignedUser->id} ({$assignedUser->name}) with performance coefficient: {$assignedUser->performance_coefficient}\n";

// Clean up (optional - comment out if you want to keep the test customer)
// $customer->delete();
// echo "Test customer deleted.\n";
