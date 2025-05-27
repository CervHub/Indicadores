<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class SetAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Quitar empresa del admin o crearlo si no existe
        $admin = User::where('email', 'admin@cerv.com.pe')->first();
        if ($admin) {
            $admin->company_id = null;
            $admin->save();
        } else {
            User::create([
                'doi' => '00000000',
                'email' => 'admin@cerv.com.pe',
                'password' => bcrypt('password'), // Contraseña actualizada
                'nombres' => 'Admin',
                'apellidos' => 'Principal',
                'telefono' => null,
                'codigo' => null,
                'cargo' => 'Administrador',
                'company_id' => null,
                'role_id' => 1, // Ajusta el ID según tu sistema
            ]);
        }
    }
}
