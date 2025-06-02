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
            'Super Admin' => ['code' => 'SA', 'descripcion' => 'Acceso total al sistema', 'nombre' => 'Super Admin'],
            'Regular User' => ['code' => 'RU', 'descripcion' => 'Usuario regular del sistema', 'nombre' => 'Regular User'],
            'Company Admin' => ['code' => 'CA', 'descripcion' => 'Administrador de empresa', 'nombre' => 'Company Admin'],
            'Ingeniero de Seguridad' => ['code' => 'IS', 'descripcion' => 'Acceso a herramientas de seguridad y reportes', 'nombre' => 'Ingeniero de Seguridad'],
            'Sub Comité de Contratistas' => ['code' => 'SCC', 'descripcion' => 'Acceso a la herramienta de consolidado y reporte', 'nombre' => 'Sub Comité de Contratistas'],
            'Almacenes' => ['code' => 'ALM', 'descripcion' => 'Acceso a la herramienta de consolidado', 'nombre' => 'Almacenes'],
            'Proyectos de Inversión' => ['code' => 'PI', 'descripcion' => 'Acceso a la herramienta de consolidado', 'nombre' => 'Proyectos de Inversión'],
            'Contratos de Obras' => ['code' => 'CO', 'descripcion' => 'Acceso a la herramienta de consolidado', 'nombre' => 'Contratos de Obras'],
            'Contratos y Servicios' => ['code' => 'CS', 'descripcion' => 'Acceso a la herramienta de consolidado', 'nombre' => 'Contratos y Servicios'],
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

        // Actualizar nombres en inglés a español
        $roleUpdates = [
            'Super Admin' => 'Super Administrador',
            'Regular User' => 'Usuario Regular',
            'Company Admin' => 'Administrador de Empresa',
        ];

        foreach ($roleUpdates as $englishName => $spanishName) {
            DB::beginTransaction();
            try {
                $role = Role::where('nombre', $englishName)->first();
                if ($role) {
                    $role->update(['nombre' => $spanishName]);
                    $this->command->info('Rol actualizado: ' . $englishName . ' -> ' . $spanishName);
                }
                DB::commit();
            } catch (Exception $e) {
                DB::rollBack();
                $this->command->error('Error al actualizar el rol: ' . $englishName . '. ' . $e->getMessage());
            }
        }
    }
}
