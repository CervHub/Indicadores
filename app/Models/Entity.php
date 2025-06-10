<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entity extends Model
{
    protected $table = 'entities';
    protected $fillable = ['nombre', 'parent_id', 'company_id', 'nivel', 'estado'];
    use HasFactory;

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
    public function parent()
    {
        return $this->belongsTo(Entity::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Entity::class, 'parent_id');
    }
    public function users()
    {
        return $this->belongsToMany(User::class, 'entity_users');
    }

}
