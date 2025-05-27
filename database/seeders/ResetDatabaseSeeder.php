<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ResetDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Lista de tablas a reajustar en el orden correcto
        $tables = [
            'annex24s',
            'annex25s',
            'annex26s',
            'annex27s',
            'annex28s',
            'annex30s',
            'minem_template1s',
            'minem_template2s',
            'module_images',
            'module_reviews',
            'file_status_histories',
            'detail_users',
            'company_consolidateds',
            'category_attributes',
            'entity_users',
            'vehicle_companies',
            'role_users',
            'consolidateds',
            'security_engineers',
            'file_statuses',
            'category_companies',
            'groups',
            'uea_companies',
            'entities',
            'system_roles',
            'levels',
            'categories',
            'users',
            'vehicles',
            'contractor_company_types',
            'companies',
            'modules',
            'settings',
            'positions',
            'roles',
            'setting_globals',
            'logs',
            'ueas',
            'sessions',
            'jobs',
            'job_batches',
            'failed_jobs',
            'password_reset_tokens',
            'personal_access_tokens',
            'migrations',
            'cache',
            'cache_locks'
        ];

        foreach ($tables as $table) {
            // Mostrar progreso en la consola
            echo "Procesando tabla: {$table}\n";

            // Desactivar restricciones de claves foráneas para la tabla
            DB::statement("ALTER TABLE {$table} NOCHECK CONSTRAINT ALL");

            // Eliminar registros de la tabla
            DB::statement("DELETE FROM {$table}");

            // Verificar si la tabla tiene una columna de identidad antes de reajustar
            $hasIdentity = DB::select("
                SELECT 1
                FROM sys.columns
                WHERE object_id = OBJECT_ID('{$table}')
                AND is_identity = 1
            ");

            if (!empty($hasIdentity)) {
                // Reajustar el autoincremento a 1
                DB::statement("DBCC CHECKIDENT ('{$table}', RESEED, 0)");
            } else {
                echo "La tabla {$table} no tiene una columna de identidad. Saltando el reajuste de autoincremento.\n";
            }

            // Reactivar restricciones de claves foráneas para la tabla
            DB::statement("ALTER TABLE {$table} WITH CHECK CHECK CONSTRAINT ALL");
        }

        // Mensaje final
        echo "Reajuste de autoincrementos completado.\n";
    }
}
