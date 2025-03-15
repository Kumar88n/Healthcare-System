<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AlterDoctorsTableAddEmergencyFee extends Migration
{
    public function up()
    {
        Schema::table('doctors', function (Blueprint $table) {
            $table->decimal('emergency_fee', 8, 2)->nullable()->after('fee');
          
        });
    }

    public function down()
    {
        Schema::table('doctors', function (Blueprint $table) {
            $table->dropColumn('emergency_fee');
        });
    }
}
