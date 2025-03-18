<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EntityUser extends Model
{
    protected $fillable = ['user_id', 'entity_id', 'cargo'];
    use HasFactory;

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function entity()
    {
        return $this->belongsTo(Entity::class);
    }
}
