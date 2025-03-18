<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ModuleImage extends Model
{
    use HasFactory;
    protected $fillable = ['module_id', 'url'];
}
