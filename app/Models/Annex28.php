<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Annex28 extends Model
{
    //Nombre de la table
    protected $table = 'annex28s';

    //campos de la table
    protected $fillable = [
        'file_status_id',
        'year',
        'month',
        'situation', // Situacion
        'employees', // Numero de empleados
        'workers', // Numero de obreros
        'incidents', // Numero de incidentes
        'dangerous_incidents', // Numero de incidentes peligrosos
        'minor_accidents', // Numero de accidentes leves
        'disability', // Numero de incapacidades
        'mortality', // Numero de mortalidades
        'lost_days', // Numero de dias perdidos
        'man_hours_worked', // Numero de horas hombre trabajadas
        'frequency_index', // Indice de frecuencia
        'severity_index', // Indice de severidad
        'accident_rate', // Tasa de accidentes
    ];
}
