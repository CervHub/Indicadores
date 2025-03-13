<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ContractorCompaniesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('contractor_companies')->insert([
            [
                'name' => 'Southern Peru Copper Corporation, Sucursal del Perú',
                'business_name' => 'SOUTHERN PERU COPPER CORPORATION, SUCURSAL DEL PERÚ',
                'ruc_number' => '20100147514',
                'contractor_company_type_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'ALFA Y OMEGA CONTRATISTAS DEL SUR S.A.C.',
                'business_name' => 'ALFA Y OMEGA CONTRATISTAS DEL SUR S.A.C.',
                'ruc_number' => '20397182518',
                'contractor_company_type_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'ATLAS COPCO PERÚ S.A.C.',
                'business_name' => 'ATLAS COPCO PERÚ S.A.C.',
                'ruc_number' => '20602579078',
                'contractor_company_type_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'ANROTEC SAC',
                'business_name' => 'ANROTEC SAC',
                'ruc_number' => '20533022899',
                'contractor_company_type_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'CALDERAS INDUSTRIALES',
                'business_name' => 'CALDERAS INDUSTRIALES',
                'ruc_number' => '20498246371',
                'contractor_company_type_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'CORPORACION DE SERVICIOS URANO S.R.L.',
                'business_name' => 'CORPORACION DE SERVICIOS URANO S.R.L.',
                'ruc_number' => '2060882934',
                'contractor_company_type_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'CRUBHER',
                'business_name' => 'CRUBHER',
                'ruc_number' => '20133148532',
                'contractor_company_type_id' => 2,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'IMCO SERVICIOS SAC',
                'business_name' => 'IMCO SERVICIOS SAC',
                'ruc_number' => '20454276761',
                'contractor_company_type_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'LINDE PERU SRL',
                'business_name' => 'LINDE PERU SRL',
                'ruc_number' => '20338570041',
                'contractor_company_type_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'LUANG ASOCIADOS S.A.C.',
                'business_name' => 'LUANG ASOCIADOS S.A.C.',
                'ruc_number' => '20532595968',
                'contractor_company_type_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'METSO PERU S.A.',
                'business_name' => 'METSO PERU S.A.',
                'ruc_number' => '20262478964',
                'contractor_company_type_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'MINING COMPANY SERVICES SAC MINCOSER',
                'business_name' => 'MINING COMPANY SERVICES SAC MINCOSER',
                'ruc_number' => '20519693080',
                'contractor_company_type_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'MOVITECNICA SA',
                'business_name' => 'MOVITECNICA SA',
                'ruc_number' => '20100172543',
                'contractor_company_type_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'MUR WY SAC',
                'business_name' => 'MUR WY SAC',
                'ruc_number' => '20470407442',
                'contractor_company_type_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'NCK INGENIEROS E.I.R.L.',
                'business_name' => 'NCK INGENIEROS E.I.R.L.',
                'ruc_number' => '20412979304',
                'contractor_company_type_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'RESUNISA EIRL',
                'business_name' => 'RESUNISA EIRL',
                'ruc_number' => '20600048083',
                'contractor_company_type_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'SELIN',
                'business_name' => 'SELIN',
                'ruc_number' => '20162335520',
                'contractor_company_type_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'SEPERSUR SRL',
                'business_name' => 'SEPERSUR SRL',
                'ruc_number' => '20115832027',
                'contractor_company_type_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'SERIMAN SAC',
                'business_name' => 'SERIMAN SAC',
                'ruc_number' => '20121022169',
                'contractor_company_type_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'SERGEAR SAC',
                'business_name' => 'SERGEAR SAC',
                'ruc_number' => '20447524415',
                'contractor_company_type_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'SKF',
                'business_name' => 'SKF',
                'ruc_number' => '20100082633',
                'contractor_company_type_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'TECNOMINA SAC',
                'business_name' => 'TECNOMINA SAC',
                'ruc_number' => '20100997810',
                'contractor_company_type_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'TIERRA GROUP INTERNATIONAL S.A.C.',
                'business_name' => 'TIERRA GROUP INTERNATIONAL S.A.C.',
                'ruc_number' => '20562912534',
                'contractor_company_type_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
