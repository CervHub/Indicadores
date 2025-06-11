<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoryCompany extends Model
{
    use HasFactory;

    protected $fillable = ['category_id', 'company_id', 'nombre', 'group_id', 'is_required', 'attribute_type', 'instruction', 'has_attributes', 'document_name', 'document_url', 'is_for_mine', 'status'];

    /**
     * Relación uno a muchos con CategoryAttribute.
     * category_company_id (en CategoryAttribute) referencia id (en CategoryCompany)
     */
    public function categoryAttributes()
    {
        return $this->hasMany(CategoryAttribute::class, 'category_id', 'id');
    }
}
