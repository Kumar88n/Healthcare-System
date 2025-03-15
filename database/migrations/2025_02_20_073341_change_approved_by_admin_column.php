<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->tinyInteger('approved_by_admin')->default(0)->change();
        });
    }

    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('approved_by_admin', ['0', '1'])->default('0')->change();
        });
    }
};
