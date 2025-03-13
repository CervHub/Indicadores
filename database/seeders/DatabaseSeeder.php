<?php

namespace Database\Seeders;

use App\Models\TypeUser;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            ContractorCompanyTypesSeeder::class,
            ContractorCompaniesSeeder::class,
            UeaSeeder::class,
            TypeUserSeeder::class,
            UserSeeder::class
        ]);
    }
}
