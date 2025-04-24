<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\CategoryCompany;
use App\Models\Group;
use Illuminate\Support\Carbon;

class InspectionVehicleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define the category data
        $categoryData = [
            'nombre' => 'Inspección Vehicular',
            'company_id' => 1,
            'is_categorized' => true,
            'is_risk' => false,
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

        // Define the grouped data
        $groupedData = [
            'DOCUMENTACIÓN' => [
                'Antigüedad del vehículo no mayor a 10 años',
                'Tarjeta de Propiedad',
                'Control de humos',
                'Revisión Técnica vigente.',
                'Seguro Obligatorio de Accidentes de Transito',
                'Placa de Identificación',
            ],
            'ACCESORIOS DE SEGURIDAD' => [
                'Botiquín',
                'Llave de ruedas y Herramientas',
                'Conos/Triángulos de Seguridad',
                'Pértiga con luz en tope (5 metros desde el piso)',
                'Circulina azul electroboscopica (Para el caso de las unidades que ingresan por la Garita Mina)',
                'Luces de neblina (En la parte superior de la cabina para el caso de unidades que ingresan por la Garita Mina)',
                'Extintor de 4 Kg. Como mínimo',
                'Protección antivuelco',
                'Gata',
            ],
            'COMPONENTES BÁSICOS DEL VEHÍCULO' => [
                'Niveles de fluidos (aceite, agua, hidrolina, de frenos, otros)',
                'Fugas de fluidos',
                'Cinturones de Seguridad',
                'Espejos',
                'Limpia parabrisas',
                'Parabrisas',
                'Lunas laterales',
                'Luces (principales, intermitentes, bajas, altas, de freno)',
                'Alarma de retroceso',
                'Parachoques',
                'Neumáticos',
                'Carrocería',
                'Claxon',
                'Barra antivuelco',
                'Cinta reflectivas',
                'Logotipo',
                'Soporte para colocar banderolas',
                'Nomenclatura de la capacidad de la grúa (Para Camión Grúa)',
                'Nivel de grúa. (Para Camión Grúa)',
                'Certificado de Operatividad. (Para Camión Grúa)',
                'Eslingas y estrobos. (Para Camión Grúa)',
                'Puntos equidistantes en el gancho (Para Camión Grúa)',
                'Alarma de rotación',
                'Gatas de grúa',
                'Freno de parqueo',
                'Vehículo lavado',
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
            foreach ($items as $nombre) {
                $categoryCompany = CategoryCompany::updateOrCreate(
                    [
                        'category_id' => $category->id,
                        'nombre' => $nombre,
                        'group_id' => $group->id,
                        'company_id' => $category->company_id,
                    ],
                    [
                        'updated_at' => Carbon::now(),
                        'created_at' => Carbon::now(),
                    ]
                );

                $this->command->info("CategoryCompany '{$categoryCompany->nombre}' in group '{$group->name}' has been created or updated with ID: {$categoryCompany->id}");
            }
        }
    }
}
