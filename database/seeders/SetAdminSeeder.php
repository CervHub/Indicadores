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
        // Buscar al único usuario con el rol 1
        $admin = User::where('role_id', 1)->first();

        if ($admin) {
            // Actualizar su contraseña y correo
            $admin->email = 'admin@spcctoquepala.com';
            $admin->password = bcrypt('admin@spcctoquepala.com'); // Contraseña actualizada
            $admin->save();
        } else {
            // Crear un nuevo administrador si no existe
            User::create([
                'doi' => '00000000',
                'email' => 'admin@spcctoquepala.com',
                'password' => bcrypt('admin@spcctoquepala.com'), // Contraseña actualizada
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
