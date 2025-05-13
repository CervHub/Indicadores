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
        $newRoles = [
            [
                'nombre' => 'Sub Comité de Contratistas',
                'descripcion' => 'Acceso a la herramienta de consolidado y reporte',
            ],
            [
                'nombre' => 'Almacenes',
                'descripcion' => 'Acceso a la herramienta de consolidado',
            ],
            [
                'nombre' => 'Proyectos de Inversión',
                'descripcion' => 'Acceso a la herramienta de consolidado',
            ],
            [
                'nombre' => 'Contratos de Obras',
                'descripcion' => 'Acceso a la herramienta de consolidado',
            ],
            [
                'nombre' => 'Contratos y Servicios',
                'descripcion' => 'Acceso a la herramienta de consolidado',
            ],
            [
                'nombre' => 'Ingeniero de Seguridad',
                'descripcion' => 'Acceso a herramientas de seguridad y reportes',
            ],
        ];

        foreach ($newRoles as $role) {
            DB::beginTransaction();
            try {
                Role::create($role);
                DB::commit();
            } catch (Exception $e) {
                DB::rollBack();
                $this->command->error('Error al crear el rol: ' . $role['nombre'] . '. ' . $e->getMessage());
            }
        }
    }
}
