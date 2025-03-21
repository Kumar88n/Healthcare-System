<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('appointments', function (Blueprint $table) {
            $table->enum('appointment_type', ['Emergency', 'Regular'])->after('status')->default('Regular');
        });
    }

    public function down(): void
    {
        Schema::table('table_name', function (Blueprint $table) {
            $table->dropColumn('appointment_type');
        });
    }
};
