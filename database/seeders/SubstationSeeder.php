<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\Substation\Models\Substation;

class SubstationSeeder extends Seeder
{
    public function run(): void
    {
        // İstersen önce tabloyu temizleyebilirsin:
        // Substation::truncate();

        Substation::insert([
            [
                'company_name' => 'Sare Gayrimenkul',
                'cover_image'  => null,         // veya 'substations/sare.png'
                'created_at'   => now(),
                'updated_at'   => now(),
            ],
            [
                'company_name' => 'MASA Tech',
                'cover_image'  => null,         // veya 'substations/masa.png'
                'created_at'   => now(),
                'updated_at'   => now(),
            ],
        ]);
    }
}
