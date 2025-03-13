<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MinemTemplate2 extends Model
{
    // Nombre de la tabla
    protected $table = 'minem_template2s';

    // Campos que se pueden llenar en la tabla
    protected $fillable = [
        'file_status_id',
        'year',
        'month',
        'concession_code',
        'concession_name',
        'male_managers',
        'male_administrative',
        'male_plant_staff',
        'male_general_operations',
        'female_managers',
        'female_administrative',
        'female_plant_staff',
        'female_general_operations'
    ];
}
