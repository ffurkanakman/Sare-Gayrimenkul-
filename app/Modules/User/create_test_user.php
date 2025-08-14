<?php

require_once __DIR__ . '/../../../vendor/autoload.php';

// Bootstrap Laravel
$app = require_once __DIR__ . '/../../../bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Modules\User\Models\User;
use Illuminate\Support\Facades\Hash;

// Check if the test user already exists
$existingUser = User::where('email', 'test@example.com')->first();

if ($existingUser) {
    echo "Test user already exists with ID: " . $existingUser->id . "\n";
    echo "Email: test@example.com\n";
    echo "Password: password123\n";
} else {
    // Create a new test user
    $user = User::create([
        'name' => 'Test',
        'surname' => 'User',
        'phone_number' => '5551234567',
        'email' => 'test@example.com',
        'password' => Hash::make('password123'),
        'status' => 1,
        'role' => 'user',
    ]);

    echo "Test user created successfully with ID: " . $user->id . "\n";
    echo "Email: test@example.com\n";
    echo "Password: password123\n";
}

echo "\nYou can use these credentials to test the authentication functionality.\n";
