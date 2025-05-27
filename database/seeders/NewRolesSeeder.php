<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Role;
use Exception;

class NewRolesSeeder extends Seeder
{
    /**
     * Ejecuta el seeder de base de datos.
     */
    public function run(): void
    {
        $rolesWithCodes = [
            'Super Admin' => ['code' => 'SA', 'descripcion' => 'Acceso total al sistema', 'nombre' => 'Super Administrador'],
            'Regular User' => ['code' => 'RU', 'descripcion' => 'Usuario regular del sistema', 'nombre' => 'Usuario Regular'],
            'Company Admin' => ['code' => 'CA', 'descripcion' => 'Administrador de empresa', 'nombre' => 'Administrador de Empresa'],
            'Ingeniero de Seguridad' => ['code' => 'IS', 'descripcion' => 'Acceso a herramientas de seguridad y reportes', 'nombre' => 'Ingeniero de Seguridad'],
        ];

        foreach ($rolesWithCodes as $key => $data) {
            DB::beginTransaction();
            try {
                Role::updateOrCreate(
                    ['nombre' => $data['nombre']],
                    [
                        'code' => $data['code'],
                        'descripcion' => $data['descripcion'],
                    ]
                );
                DB::commit();
            } catch (Exception $e) {
                DB::rollBack();
                $this->command->error('Error al crear el rol: ' . $data['nombre'] . '. ' . $e->getMessage());
            }
        }
    }
}
