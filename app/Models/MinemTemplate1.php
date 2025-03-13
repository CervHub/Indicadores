<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MinemTemplate1 extends Model
{
    // Nombre de la tabla
    protected $table = 'minem_template1s';

    // Campos que se pueden llenar en la tabla
    protected $fillable = [
        'file_status_id',
        'year',
        'month',
        'concession_name',
        'concession_code',
        'local_male_workers',
        'regional_male_workers',
        'national_male_workers',
        'foreign_male_workers',
        'local_female_workers',
        'regional_female_workers',
        'national_female_workers',
        'foreign_female_workers',
        'local_male_employees',
        'regional_male_employees',
        'national_male_employees',
        'foreign_male_employees',
        'local_female_employees',
        'regional_female_employees',
        'national_female_employees',
        'foreign_female_employees',
        'total_employees',
        'total_hours_employees',
        'mining_activities'
    ];
}
