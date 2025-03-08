<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterDoctorsTableAddFeeEmergencyFields extends Migration
{
    public function up()
    {
        Schema::table('doctors', function (Blueprint $table) {
            $table->decimal('fee', 8, 2)->after('department');
            $table->boolean('emergency_available')->default(false)->after('fee');
            $table->longText('emergency_schedule')->nullable()->after('emergency_available');
        });
    }

    public function down()
    {
        Schema::table('doctors', function (Blueprint $table) {
            $table->dropColumn('fee');
            $table->dropColumn('emergency_available');
            $table->dropColumn('emergency_schedule');
        });
    }
}
