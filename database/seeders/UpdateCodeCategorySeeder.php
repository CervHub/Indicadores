<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UpdateCodeCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Incidentes', 'code' => 'INCIDENTES'],
            ['name' => 'Actos', 'code' => 'ACTOS'],
            ['name' => 'Condiciones', 'code' => 'CONDICIONES'],
            ['name' => 'Inspección', 'code' => 'INSPECCION'],
        ];

        foreach ($categories as $cat) {
            DB::table('categories')
                ->where('nombre', $cat['name'])
                ->update(['code' => $cat['code']]);
        }
    }
}
