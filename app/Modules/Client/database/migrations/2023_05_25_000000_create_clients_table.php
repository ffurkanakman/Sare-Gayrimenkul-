<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('company_name');       // Firma Adı
            $table->string('authorized_person');  // Yetkili Adı
            $table->string('phone')->nullable();  // Telefon
            $table->text('address')->nullable();  // Adres
            $table->timestamps();
        });

    }

    public function down()
    {
        Schema::dropIfExists('clients');
    }
};
