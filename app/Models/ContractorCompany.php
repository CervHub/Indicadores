<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContractorCompany extends Model
{
    //Nombre de la tabla
    protected $table = 'contractor_companies';

    //Campos de la tabla
    protected $fillable = [
        'name', // Obligatorio
        'business_name', // Opcional
        'email', // Opcional
        'phone_number', // Opcional
        'address', // Opcional
        'city', // Opcional
        'country', // Opcional
        'ruc_number', // Obligatorio
        'contractor_company_type_id', // Tipo de cliente
    ];

    // Relación con ContractorCompanyType
    public function contractorCompanyType()
    {
        return $this->belongsTo(ContractorCompanyType::class);
    }
}
