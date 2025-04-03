<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SettingGlobal extends Model
{
    // tabla de la base de datos
    protected $table = 'setting_globals';

    // campos que se pueden asignar masivamente
    protected $fillable = [
        'web_version',
        'mobile_version',
        'logo',
        'mini_logo',
        'general_notes',
    ];
}
