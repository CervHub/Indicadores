<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehicleCompany extends Model
{
    protected $table = 'vehicle_companies';

    protected $fillable = [
        'vehicle_id',
        'company_id',
        'is_linked',
        'linked_by',
        'unlinked_by',
    ];

    // Relaciones
    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function linkedBy()
    {
        return $this->belongsTo(User::class, 'linked_by');
    }

    public function unlinkedBy()
    {
        return $this->belongsTo(User::class, 'unlinked_by');
    }
}
