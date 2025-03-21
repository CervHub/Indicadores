<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanyConsolidated extends Model
{
    // Nombre de la tabla
    protected $table = 'company_consolidateds';

    // Campos que se pueden llenar de forma masiva
    protected $fillable = [
        'company_id',
        'consolidated_id',
    ];

    // Relación con la tabla companies
    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }
}
