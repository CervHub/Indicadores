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
            ['name' => 'Concentradora Botiflaca'],
            ['created_at' => now(), 'updated_at' => now()]
        );
        Uea::updateOrCreate(
            ['name' => 'Acumulación Cuajone'],
            ['created_at' => now(), 'updated_at' => now()]
        );
        Uea::updateOrCreate(
            ['name' => 'Lixiviación Cuajone'],
            ['created_at' => now(), 'updated_at' => now()]
        );
    }
}
