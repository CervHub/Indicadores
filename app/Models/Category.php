<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['nombre', 'company_id', 'is_categorized', 'is_risk', 'code'];
    use HasFactory;

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
    public function categoryCompanies()
    {
        return $this->hasMany(CategoryCompany::class);
    }
    public function groups()
    {
        return $this->hasMany(Group::class);
    }
}
