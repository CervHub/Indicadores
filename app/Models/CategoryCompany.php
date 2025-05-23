<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoryCompany extends Model
{
    use HasFactory;

    protected $fillable = ['category_id', 'company_id', 'nombre', 'group_id', 'is_required'];
}
