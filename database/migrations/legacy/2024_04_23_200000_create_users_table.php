<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('doi');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('nombres');
            $table->string('apellidos')->nullable();
            $table->string('telefono')->nullable();
            $table->string('codigo')->nullable();
            $table->string('cargo')->nullable();
            $table->unsignedBigInteger('entity_id')->nullable();
            $table->unsignedBigInteger('company_id')->nullable();
            $table->unsignedBigInteger('role_id')->nullable();
            $table->boolean('estado')->default(true);
            $table->rememberToken();
            $table->timestamps();

            $table->foreign('entity_id')->references('id')->on('entities')->onDelete('set null');
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('no action');
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
