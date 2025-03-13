<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TypeUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Insertar los roles de usuario en la tabla type_users
        DB::table('type_users')->insert([
            ['name' => 'admin', 'description' => 'Tiene control total sobre el sistema'],
            ['name' => 'company_admin', 'description' => 'Administra las empresas y sus recursos'],
            ['name' => 'security_engineer', 'description' => 'Crea y gestiona usuarios'],
            ['name' => 'user', 'description' => 'Usa el aplicativo con permisos limitados'],
        ]);
    }
}
