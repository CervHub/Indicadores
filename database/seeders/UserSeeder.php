<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ContractorCompany;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Faker\Factory as Faker;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        // Crear el usuario administrador
        User::create([
            'name' => 'Admin',
            'email' => 'admin@cerv.com.pe',
            'password' => Hash::make('1234'),
            'type_user_id' => 1, // Asumiendo que el ID del rol 'admin' es 1
        ]);

        // Obtener todas las empresas
        $companies = ContractorCompany::all();

        // Crear un usuario company_admin para cada empresa
        foreach ($companies as $company) {
            User::create([
                'contractor_company_id' => $company->id,
                'name' => $faker->name,
                'email' => 'test' . Str::padLeft($company->id, 2, '0') . '@cerv.com.pe',
                'password' => Hash::make('1234'),
                'type_user_id' => 2, // Asumiendo que el ID del rol 'company_admin' es 2
            ]);
        }
    }
}
