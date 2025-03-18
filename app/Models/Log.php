<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Log extends Model
{
    use HasFactory;

    protected $fillable = [
        'action',
        'model',
        'model_name',
        'user_id',
        'ip_address',
        'user_agent',
        'status',
        'error_message',
    ];
}
