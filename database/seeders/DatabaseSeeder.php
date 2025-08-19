<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
// use App\Models\User;  // istersen dursun

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // İstersen user factory kalsın / kaldır:
        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        // 🚀 Substation seeder’ı çalıştır
        $this->call([
            SubstationSeeder::class,
        ]);
    }
}
