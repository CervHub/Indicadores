<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InitialDatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call([
            ContractorCompanyTypesSeeder::class,
            NewRolesSeeder::class,
            UpdateRoleCodeSeeder::class,
            UeaSeeder::class,
        ]);
    }
}
