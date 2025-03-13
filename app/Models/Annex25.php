<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Annex25 extends Model
{
    //Nombre de la table
    protected $table = 'annex25s';

    //Campos de la tabla
    protected $fillable = [
        'file_status_id',
        'year',
        'month',
        'empl',
        'obr',
        'day1',
        'day2',
        'day3',
        'day4',
        'day5',
        'day6',
        'day7',
        'day8',
        'day9',
        'day10',
        'day11',
        'day12',
        'day13',
        'day14',
        'day15',
        'day16',
        'day17',
        'day18',
        'day19',
        'day20',
        'day21',
        'day22',
        'created_at',
        'updated_at',
    ];
}
