<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Company;
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
        if (!User::where('email', 'admin@cerv.com.pe')->exists()) {
            User::create([
                'name' => 'Admin',
                'email' => 'admin@cerv.com.pe',
                'password' => Hash::make('1234'),
                'role_id' => 1, // Asumiendo que el ID del rol 'admin' es 1
                'nombres' => 'Admin',
                'apellidos' => 'User',
                'doi' => str_pad($faker->numberBetween(0, 99999999), 8, '0', STR_PAD_LEFT), // Add the doi field with 8-digit number as string
            ]);
        }

        // Obtener todas las empresas
        $companies = Company::all();

        // Crear un usuario company_admin para cada empresa
        foreach ($companies as $company) {
            $email = 'test' . Str::padLeft($company->id, 2, '0') . '@cerv.com.pe';
            if (!User::where('email', $email)->exists()) {
                User::create([
                    'company_id' => $company->id,
                    'name' => $faker->name,
                    'email' => $email,
                    'password' => Hash::make('1234'),
                    'role_id' => 2, // Asumiendo que el ID del rol 'company_admin' es 2
                    'nombres' => $faker->firstName,
                    'apellidos' => $faker->lastName,
                    'doi' => str_pad($faker->numberBetween(0, 99999999), 8, '0', STR_PAD_LEFT), // Add the doi field with 8-digit number as string
                ]);
            }
        }
    }
}
