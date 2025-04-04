<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            // No schema changes needed
        });

        // Update emails for companies
        DB::table('companies')->update([
            'email' => DB::raw("CONCAT(ruc, '@code.com.pe')")
        ]);

        // Update emails and passwords for users with role_id indicating they are companies
        $users = DB::table('users')->where('role_id', 3)->get();
        foreach ($users as $user) {
            $doi = $user->doi;
            DB::table('users')->where('id', $user->id)->update([
                'email' => $doi . '@code.com.pe',
                'password' => Hash::make($doi),
                'text_password' => $doi
            ]);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('companies', function (Blueprint $table) {
            // No schema changes needed
        });
    }
};
