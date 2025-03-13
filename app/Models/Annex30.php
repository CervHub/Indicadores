<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Annex30 extends Model
{
    // Nombre de la table
    protected $table = 'annex30s';

    // Campos que se pueden llenar en la tabla
    protected $fillable = [
        'file_status_id',
        'year',
        'month',
        'accident_type',
        'injury_nature',
        'age',
        'marital_status',
        'education_level',
        'years_experience',
        'time',
        'day',
        'month_name',
        'partial_temporary',
        'permanent_temporary',
        'partial_permanent',
        'total_permanent',
        'disability',
        'occupation',
        'remuneration'
    ];
}
