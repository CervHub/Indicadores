<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}
