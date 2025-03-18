<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FileStatusHistory extends Model
{
    // Define the table name
    protected $table = 'file_status_histories';

    // Define the fillable columns
    protected $fillable = [
        'file_status_id',
        'user_id',
        'file_path',
    ];
}
