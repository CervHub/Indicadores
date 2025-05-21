<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UeaCompany extends Model
{
    protected $table = 'uea_companies';

    protected $fillable = [
        'uea_id',
        'company_id',
        'activity_id'
    ];

    public function uea()
    {
        // Relación explícita: UeaCompany.uea_id -> Uea.id
        return $this->belongsTo(Uea::class, 'uea_id', 'id');
    }

    public function company()
    {
        // Relación explícita: UeaCompany.company_id -> Company.id
        return $this->belongsTo(Company::class, 'company_id', 'id');
    }

    public function activity()
    {
        // Relación explícita: UeaCompany.activity_id -> ContractorCompanyType.id
        return $this->belongsTo(ContractorCompanyType::class, 'activity_id', 'id');
    }
}
