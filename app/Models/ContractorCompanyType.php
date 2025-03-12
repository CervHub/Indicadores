<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ContractorCompanyType extends Model
{
    use HasFactory, SoftDeletes;

    //Nombre de la tabla
    protected $table = 'contractor_company_types';

    //Campos de la tabla
    protected $fillable = [
        'name',
        'abbreviation',
    ];

    // Relación con ContractorCompany
    public function contractorCompanies()
    {
        return $this->hasMany(ContractorCompany::class);
    }
}
