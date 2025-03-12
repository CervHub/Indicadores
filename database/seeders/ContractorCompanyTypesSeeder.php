<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ContractorCompanyTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //Insertamos los tipos de empresas contratistas
        DB::table('contractor_company_types')->insert([
            ['name' => 'Titular', 'abbreviation' => 'T', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'Empresa Contratista Minero', 'abbreviation' => 'E', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()],
            ['name' => 'Empresa Conexa', 'abbreviation' => 'O', 'created_at' => Carbon::now(), 'updated_at' => Carbon::now()]
        ]);
    }
}
