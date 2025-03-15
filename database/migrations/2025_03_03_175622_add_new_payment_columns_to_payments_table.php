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
        Schema::table('payments', function (Blueprint $table) {
            $table->string('paymentProvider')->nullable()->after('status');
            $table->string('paymentIntentId')->nullable()->after('paymentProvider');
            $table->string('payment_mode')->nullable()->after('paymentIntentId');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropColumn('paymentProvider');
            $table->dropColumn('paymentIntentId');
            $table->dropColumn('payment_mode');
        });
    }
};
