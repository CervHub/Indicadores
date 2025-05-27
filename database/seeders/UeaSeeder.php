<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Uea; // Asegúrate de importar el modelo Uea

class UeaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Uea::updateOrCreate(
            ['name' => 'SPCC - CONCENTRADORA CUAJONE'],
            ['created_at' => now(), 'updated_at' => now()]
        );
        Uea::updateOrCreate(
            ['name' => 'SPCC - ACUMULACION CUAJONE'],
            ['created_at' => now(), 'updated_at' => now()]
        );
        Uea::updateOrCreate(
            ['name' => 'SPCC - PLANTA LIXIVIAXION SX/EW CUAJONE'],
            ['created_at' => now(), 'updated_at' => now()]
        );
    }
}
