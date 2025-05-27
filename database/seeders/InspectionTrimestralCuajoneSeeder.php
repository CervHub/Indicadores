<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Group;
use App\Models\CategoryCompany;
use Carbon\Carbon;

class InspectionTrimestralCuajoneSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define the category data
        $categoryData = [
            'nombre' => 'Inspección Trimestral',
            'code' => 'IVT',
            'company_id' => 1,
            'is_categorized' => true,
        ];

        // Create or update the category
        $category = Category::updateOrCreate(
            ['nombre' => $categoryData['nombre']],
            array_merge($categoryData, [
                'updated_at' => Carbon::now(),
                'created_at' => Carbon::now(),
            ])
        );

        $this->command->info("Category '{$category->nombre}' has been created or updated with ID: {$category->id}");

        // Define the grouped data (cada item es array asociativo)
        $groupedData = [
            'DOCUMENTACIÓN' => [
                ['nombre' => 'Antigüedad del vehículo no mayor a 5 años', 'is_for_mine' => false, 'is_not_for_mine' => false, 'is_required' => false],
                ['nombre' => 'Tarjeta de Propiedad', 'is_for_mine' => false, 'is_not_for_mine' => false, 'is_required' => false],
                ['nombre' => 'Revisión Técnica vigente.', 'is_for_mine' => false, 'is_not_for_mine' => false, 'is_required' => false],
                ['nombre' => 'Seguro Obligatorio de Accidentes de Transito', 'is_for_mine' => false, 'is_not_for_mine' => false, 'is_required' => false],
                ['nombre' => 'Placa de Identificación', 'is_for_mine' => false, 'is_not_for_mine' => false, 'is_required' => false],
            ],
            'ACCESORIOS DE SEGURIDAD' => [
                ['nombre' => 'Botiquín', 'is_for_mine' => false, 'is_not_for_mine' => false, 'is_required' => false],
                ['nombre' => 'Llave de ruedas y Herramientas', 'is_for_mine' => false, 'is_not_for_mine' => false, 'is_required' => false],
                ['nombre' => 'Conos/Triángulos de Seguridad', 'is_for_mine' => false, 'is_not_for_mine' => false, 'is_required' => false],
                ['nombre' => 'Pértiga con luz en tope (4.5 metros desde el piso)', 'is_for_mine' => true, 'is_not_for_mine' => false, 'is_required' => false],
                ['nombre' => 'Circulina azul electroboscopica (Para el caso de las unidades que ingresan por la Garita Mina)', 'is_for_mine' => true, 'is_not_for_mine' => false, 'is_required' => false],
                ['nombre' => 'Luces de neblina (En la parte superior de la cabina para el caso de unidades que ingresan por la Garita Mina)', 'is_for_mine' => true, 'is_not_for_mine' => false, 'is_required' => false],
                ['nombre' => 'Extintor de 4 Kg. Como mínimo', 'is_for_mine' => false, 'is_not_for_mine' => false, 'is_required' => false],
                ['nombre' => 'Protección antivuelco', 'is_for_mine' => false, 'is_not_for_mine' => false, 'is_required' => false],
                ['nombre' => 'Gata', 'is_for_mine' => false, 'is_not_for_mine' => false, 'is_required' => false],
            ],
            'COMPONENTES BÁSICOS DEL VEHÍCULO' => [
                ['nombre' => 'Niveles de fluidos (aceite, agua, hidrolina, de frenos, otros)', 'is_for_mine' => false, 'is_not_for_mine' => false, 'is_required' => false],
                ['nombre' => 'Fugas de fluidos', 'is_for_mine' => false, 'is_not_for_mine' => false, 'is_required' => false],
                ['nombre' => 'Cinturones de Seguridad', 'is_for_mine' => false, 'is_not_for_mine' => false, 'is_required' => false],
                ['nombre' => 'Espejos', 'is_for_mine' => false, 'is_not_for_mine' => false, 'is_required' => false],
                ['nombre' => 'Banderín Rojo', 'is_for_mine' => true, 'is_not_for_mine' => false, 'is_required' => false],
                ['nombre' => 'Banderín Verde', 'is_for_mine' => false, 'is_not_for_mine' => true, 'is_required' => false],
                ['nombre' => 'Limpia parabrisas', 'is_for_mine' => false, 'is_not_for_mine' => false, 'is_required' => false],
                ['nombre' => 'Parabrisas', 'is_for_mine' => false, 'is_not_for_mine' => false, 'is_required' => false],
                ['nombre' => 'Lunas laterales', 'is_for_mine' => false, 'is_not_for_mine' => false, 'is_required' => false],
                ['nombre' => 'Luces (principales, intermitentes, bajas, altas, de freno)', 'is_for_mine' => false, 'is_not_for_mine' => false, 'is_required' => false],
                ['nombre' => 'Alarma de retroceso', 'is_for_mine' => false, 'is_not_for_mine' => false, 'is_required' => false],
                ['nombre' => 'Parachoques', 'is_for_mine' => false, 'is_not_for_mine' => false, 'is_required' => false],
                ['nombre' => 'Neumáticos', 'is_for_mine' => false, 'is_not_for_mine' => false, 'is_required' => false],
                ['nombre' => 'Carrocería', 'is_for_mine' => false, 'is_not_for_mine' => false, 'is_required' => false],
                ['nombre' => 'Claxon', 'is_for_mine' => false, 'is_not_for_mine' => false, 'is_required' => false],
                ['nombre' => 'Cinta reflectiva Roja y Blanca', 'is_for_mine' => false, 'is_not_for_mine' => true, 'is_required' => false],
                ['nombre' => 'Cinta reflectiva Amarilla', 'is_for_mine' => true, 'is_not_for_mine' => false, 'is_required' => false],
                ['nombre' => 'Logotipo', 'is_for_mine' => false, 'is_not_for_mine' => false, 'is_required' => false],
                ['nombre' => 'Nomenclatura de la capacidad de la grúa (Para Camión Grúa)', 'is_for_mine' => false, 'is_not_for_mine' => false, 'is_required' => true],
                ['nombre' => 'Nivel de grúa. (Para Camión Grúa)', 'is_for_mine' => false, 'is_not_for_mine' => false, 'is_required' => true],
                ['nombre' => 'Certificado de Operatividad. (Para Camión Grúa)', 'is_for_mine' => false, 'is_not_for_mine' => false, 'is_required' => true],
                ['nombre' => 'Eslingas y estrobos. (Para Camión Grúa)', 'is_for_mine' => false, 'is_not_for_mine' => false, 'is_required' => true],
                ['nombre' => 'Puntos equidistantes en el gancho (Para Camión Grúa)', 'is_for_mine' => false, 'is_not_for_mine' => false, 'is_required' => true],
                ['nombre' => 'Alarma de rotación (Para Camión Grúa)', 'is_for_mine' => false, 'is_not_for_mine' => false, 'is_required' => true],
                ['nombre' => 'Gatas de grúa', 'is_for_mine' => false, 'is_not_for_mine' => false, 'is_required' => true],
                ['nombre' => 'Certificado de operatividad', 'is_for_mine' => false, 'is_not_for_mine' => false, 'is_required' => false],
                ['nombre' => 'Freno de parqueo', 'is_for_mine' => false, 'is_not_for_mine' => false, 'is_required' => false],
                ['nombre' => 'Vehículo lavado', 'is_for_mine' => false, 'is_not_for_mine' => false, 'is_required' => false],
            ],
        ];

        // Loop through each group and create or update the category company
        foreach ($groupedData as $groupName => $items) {
            // Create or update the group
            $group = Group::updateOrCreate(
                [
                    'name' => $groupName,
                    'category_id' => $category->id
                ], // Match condition
                [
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ]
            );

            $this->command->info("Group '{$group->name}' has been created or updated with ID: {$group->id}");

            // Loop through each item in the group
            foreach ($items as $item) {
                $categoryCompany = CategoryCompany::updateOrCreate(
                    [
                        'category_id' => $category->id,
                        'nombre' => $item['nombre'],
                        'group_id' => $group->id,
                        'company_id' => $category->company_id,
                    ],
                    [
                        'updated_at' => Carbon::now(),
                        'created_at' => Carbon::now(),
                        'is_for_mine' => $item['is_for_mine'],
                        'is_not_for_mine' => $item['is_not_for_mine'],
                        'is_required' => $item['is_required'],
                    ]
                );

                $this->command->info("CategoryCompany '{$categoryCompany->nombre}' in group '{$group->name}' has been created or updated with ID: {$categoryCompany->id}");
            }
        }
    }
}
