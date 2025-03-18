<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SecurityEngineer extends Model
{
    use HasFactory;

    // table
    protected $table = 'security_engineers';

    // fillable
    protected $fillable = [
        'user_id',
        'company_id',
        'status',
    ];
}
