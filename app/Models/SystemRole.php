<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Level;

class SystemRole extends Model
{
    use HasFactory;
    public function level()
    {
        return $this->belongsTo(Level::class);
    }
}
