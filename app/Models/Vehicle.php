<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class Vehicle extends Model
{
    protected $table = 'vehicles';

    protected $fillable = [
        'id',
        'code', // Código único del vehículo
        'license_plate', // Placa del vehículo
        'brand', // Marca del vehículo
        'model', // Modelo del vehículo
        'color', // Color del vehículo
        'year', // Año de fabricación
        'engine_number', // Número de motor
        'chassis_number', // Número de chasis
        'type', // Tipo de vehículo (e.g., sedán, SUV)
        'fuel_type', // Tipo de combustible (e.g., gasolina, diésel)
        'seating_capacity', // Capacidad de asientos
        'mileage', // Kilometraje del vehículo
        'is_active', // Estado activo/inactivo del vehículo
        'insurance_expiry_date', // Fecha de vencimiento del seguro
    ];

    /**
     * Retorna siempre 4 inspecciones (una de cada tipo), si no existe, retorna campos vacíos.
     */
    public function getCompanyInspections()
    {
        $lastCompany = $this->vehicleCompanies()
            ->where('is_linked', true)
            ->latest('id')
            ->first();

        if (!$lastCompany) {
            // Retorna 4 vacíos si no hay compañía vinculada
            return collect([
                'pre-use'    => $this->emptyInspection('pre-use'),
                'trimestral' => $this->emptyInspection('trimestral'),
                'semestral'  => $this->emptyInspection('semestral'),
                'anual'      => $this->emptyInspection('anual'),
            ]);
        }

        $companyId = $lastCompany->company_id;

        $modules = DB::table('modules')
            ->where('vehicle_plate', $this->license_plate)
            ->where('company_id', $companyId)
            ->orderByDesc('created_at')
            ->get();

        $tipoMap = [
            'pre-use'    => 'Diaria Pre-Uso',
            'trimestral' => 'Trimestral',
            'semestral'  => 'Semestral',
            'anual'      => 'Anual',
        ];

        // Obtén los user_ids únicos
        $userIds = $modules->pluck('user_id')->filter()->unique()->all();
        $users = [];
        if (!empty($userIds)) {
            $users = User::whereIn('id', $userIds)
                ->get()
                ->keyBy('id');
        }

        // Solo la inspección más reciente de cada tipo
        $tiposPermitidos = array_keys($tipoMap);
        $inspeccionesPorTipo = [];

        foreach ($modules as $module) {
            $tipo = $module->tipo_inspeccion;
            if (in_array($tipo, $tiposPermitidos) && !isset($inspeccionesPorTipo[$tipo])) {
                $inspeccionesPorTipo[$tipo] = $module;
            }
        }

        $formatFecha = function ($fecha) {
            if (!$fecha) return null;
            // Convierte a hora de Perú (America/Lima)
            return \Carbon\Carbon::parse($fecha)
                ->setTimezone('America/Lima')
                ->format('d/m/Y H:i');
        };

        $getVencimiento = function ($tipo, $created_at) {
            if (!$created_at) return null;
            $fecha = \Carbon\Carbon::parse($created_at)
                ->setTimezone('America/Lima')
                ->startOfDay();
            switch ($tipo) {
                case 'pre-use':
                    return $fecha->setTime(23, 59)->format('d/m/Y H:i');
                case 'trimestral':
                    return $fecha->addMonths(3)->setTime(23, 59)->format('d/m/Y H:i');
                case 'semestral':
                    return $fecha->addMonths(6)->setTime(23, 59)->format('d/m/Y H:i');
                case 'anual':
                    return $fecha->addYear()->setTime(23, 59)->format('d/m/Y H:i');
                default:
                    return null;
            }
        };

        $result = collect();

        foreach ($tipoMap as $tipoKey => $tipoLabel) {
            if (isset($inspeccionesPorTipo[$tipoKey])) {
                $module = $inspeccionesPorTipo[$tipoKey];
                $details = [];
                if (!empty($module->details)) {
                    $details = json_decode($module->details, true) ?? [];
                }
                $observaciones = $details['observation'] ?? $module->observaciones ?? ($module->comentario ?? null);
                $user = isset($users[$module->user_id]) ? $users[$module->user_id] : null;
                $realizado_por = $user ? trim(($user->nombres ?? '') . ' ' . ($user->apellidos ?? '')) : null;

                $result[$tipoKey] = [
                    'id' => $module->id,
                    'vehicle_status' => $module->vehicle_status ?? null,
                    'tipo_inspeccion' => $tipoLabel,
                    'estado' => $module->estado ?? null,
                    'created_at' => $formatFecha($module->created_at),
                    'updated_at' => $formatFecha($module->updated_at),
                    'realizado_por' => $realizado_por,
                    'observaciones' => $observaciones,
                    'vencimiento' => $getVencimiento($tipoKey, $module->created_at),
                ];
            } else {
                $result[$tipoKey] = $this->emptyInspection($tipoKey, $tipoLabel);
            }
        }
        return collect($result);
    }

    /**
     * Devuelve un array vacío para un tipo de inspección.
     */
    protected function emptyInspection($tipoKey, $tipoLabel = null)
    {
        $tipoMap = [
            'pre-use'    => 'Diaria Pre-Uso',
            'trimestral' => 'Trimestral',
            'semestral'  => 'Semestral',
            'anual'      => 'Anual',
        ];
        return [
            'id' => null,
            'vehicle_status' => null,
            'tipo_inspeccion' => $tipoLabel ?? ($tipoMap[$tipoKey] ?? ucfirst($tipoKey)),
            'estado' => null,
            'created_at' => null,
            'updated_at' => null,
            'realizado_por' => null,
            'observaciones' => null,
            'vencimiento' => null,
        ];
    }

    public function vehicleCompanies()
    {
        return $this->hasMany(VehicleCompany::class, 'vehicle_id', 'id');
    }
}
