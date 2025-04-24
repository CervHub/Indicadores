<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Vehicle;
use Faker\Factory as Faker;
use Illuminate\Support\Carbon;

class VehicleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create();

        // Tipos de vehículos
        $vehicleTypes = ['Camioneta', 'Combi', 'Ambulancia', 'Bus', 'Camión', 'Camión Grúa', 'Otros'];

        // Generar 100 vehículos aleatorios
        for ($i = 1; $i <= 100; $i++) {
            $vehicleData = [
                'code' => 'V' . str_pad($i, 3, '0', STR_PAD_LEFT), // Código único
                'license_plate' => strtoupper($faker->bothify('???-###')), // Placa aleatoria
                'brand' => $faker->randomElement(['Toyota', 'Hyundai', 'Mercedes-Benz', 'Volvo', 'Scania', 'MAN', 'Suzuki']),
                'model' => $faker->randomElement([
                    'Hilux',
                    'Sprinter',
                    'Actros',
                    'XC90',
                    'S-Cross',
                    'Canter',
                    'Transit',
                    'Ranger',
                    'Civic',
                    'Corolla',
                    'Accord',
                    'Tucson',
                    'Elantra',
                    'Santa Fe',
                    'Outlander',
                    'Pajero',
                    'Lancer',
                    'CX-5',
                    'CX-9',
                    'Forester',
                    'Impreza'
                ]),
                'color' => $faker->safeColorName(),
                'year' => $faker->numberBetween(2000, 2025), // Año entre 2000 y 2025
                'engine_number' => strtoupper($faker->bothify('ENG#####')),
                'chassis_number' => strtoupper($faker->bothify('CHS#####')),
                'type' => $faker->randomElement($vehicleTypes), // Tipo aleatorio
                'fuel_type' => $faker->randomElement(['Gasolina', 'Diesel', 'Gas']),
                'seating_capacity' => $faker->numberBetween(2, 50), // Capacidad entre 2 y 50
                'mileage' => $faker->numberBetween(1000, 300000), // Kilometraje entre 1,000 y 300,000
                'is_active' => $faker->boolean(80), // 80% de probabilidad de estar activo
                'insurance_expiry_date' => $faker->dateTimeBetween('-1 year', '+1 year'), // Fecha entre el año pasado y el próximo año
            ];

            // Crear o actualizar el vehículo
            $vehicle = Vehicle::updateOrCreate(
                ['code' => $vehicleData['code']], // Condición de coincidencia
                $vehicleData // Datos a insertar o actualizar
            );

            $this->command->info("Vehicle '{$vehicle->code}' has been created or updated with ID: {$vehicle->id}");
        }
    }
}
