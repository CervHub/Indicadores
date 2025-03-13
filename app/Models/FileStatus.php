<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FileStatus extends Model
{
    // Nombre de la table
    protected $table = 'file_statuses';

    // Campos que se pueden llenar
    protected $fillable = [
        'contractor_company_id',
        'contractor_company_type_id',
        'uea_id',
        'user_id',
        'month',
        'year',
        'file',
        'annex24',
        'annex25',
        'annex26',
        'annex27',
        'annex28',
        'annex30',
        'minem_template_1',
        'minem_template_2',
        'is_old',
    ];

    //Relaciones
    public function annex24()
    {
        return $this->hasMany(Annex24::class);
    }

    public function annex25()
    {
        return $this->hasMany(Annex25::class);
    }

    // Agrega las relaciones para los otros anexos si es necesario
    public function annex26()
    {
        return $this->hasMany(Annex26::class);
    }

    public function annex27()
    {
        return $this->hasMany(Annex27::class);
    }

    public function annex28()
    {
        return $this->hasMany(Annex28::class);
    }

    public function annex30()
    {
        return $this->hasMany(Annex30::class);
    }

    public function minemTemplate1()
    {
        return $this->hasMany(MinemTemplate1::class);
    }

    public function minemTemplate2()
    {
        return $this->hasMany(MinemTemplate2::class);
    }
}
