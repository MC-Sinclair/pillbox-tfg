<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("ALTER TABLE administrations MODIFY COLUMN status ENUM('pending','administered','refused','difficulty','missed') NOT NULL DEFAULT 'pending'");
    }

    public function down(): void
    {
        DB::statement("ALTER TABLE administrations MODIFY COLUMN status ENUM('pending','administered','refused','difficulty') NOT NULL DEFAULT 'pending'");
    }
};