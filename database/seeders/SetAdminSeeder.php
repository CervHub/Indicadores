<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;

class SetAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Quitar empresa del admin
        $admin = User::where('email', 'admin@cerv.com.pe')->first();
        if ($admin) {
            $admin->company_id = null;
            $admin->save();
        }
    }
}
