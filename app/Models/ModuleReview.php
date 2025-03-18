<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModuleReview extends Model
{
    use HasFactory;

    //table
    protected $table = 'module_reviews';

    //fillable
    protected $fillable = [
        'module_id',
        'user_id',
        'comentario',
        'fotos'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
