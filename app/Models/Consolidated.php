<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Consolidated extends Model
{
    // Nombre de la table
    protected $table = 'consolidateds';

    // Campos de la tabla
    protected $fillable = [
        'user_id',
        'year',
        'month',
        'is_closed',
        'file_sx_ew',
        'file_accumulation',
        'file_concentrator',
    ];
}
