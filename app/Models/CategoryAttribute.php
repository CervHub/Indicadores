<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CategoryAttribute extends Model
{
    protected $table = 'category_attributes';

    protected $fillable = [
        'category_id',
        'name',
        'attribute_type',
        'min_value',
        'unit'
    ];
}
