<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\CategoryCompany;
use Carbon\Carbon;

class InspectionPreUseCuajoneSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */

    public function run(): void
    {
        // Define the category data
        $categoryData = [
            'nombre' => 'Inspección de pre-uso',
            'company_id' => 1,
            'is_categorized' => false,
            'code' => 'IVDPU',
        ];

        // Use Eloquent to create or update the category
        $category = Category::updateOrCreate(
            [
                'code' => $categoryData['code']
            ], // Match condition
            array_merge($categoryData, [
                'nombre' => $categoryData['nombre'],
                'updated_at' => Carbon::now(),
                'created_at' => Carbon::now(),
            ]) // Data to insert/update
        );

        $this->command->info("Category '{$category->nombre}' has been created or updated with ID: {$category->id}");

        // Define the category company data
        $categoryCompanyData = [
            'Nivel de aceite de motor',
            'Nivel de líquido de freno',
            'Nivel de agua de radiador',
            'Dirección',
            'Freno de servicio',
            'Frenos de parqueo',
            'Luces: delanteras, posteriores, direccionales, emergencia',
            'Luz de día',
            'Neumáticos',
            'Espejos',
            'Claxon',
            'Cinturones de seguridad',
            'Extintor',
            'Circulina y Neblineros',
            'Alarma de retroceso',
            'Gata y llave de ruedas',
            'Llanta de repuesto',
            'Triángulos de seguridad',
            'Botiquín',
            'Otros',
        ];

        // Loop through each item and create or update the category company
        foreach ($categoryCompanyData as $nombre) {
            $categoryCompany = CategoryCompany::updateOrCreate(
                [
                    'category_id' => $category->id,
                    'nombre' => $nombre,
                ], // Match condition
                [
                    'company_id' => $category->company_id,
                    'group_id' => null,
                    'updated_at' => Carbon::now(),
                    'created_at' => Carbon::now(),
                ] // Data to insert/update
            );

            $this->command->info("CategoryCompany '{$categoryCompany->nombre}' has been created or updated with ID: {$categoryCompany->id}");
        }
    }
}
