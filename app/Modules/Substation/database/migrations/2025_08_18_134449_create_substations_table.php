<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('substations', function (Blueprint $table) {
            $table->id();
            // Firma adı (veya firma ilişkisi olacaksa company_id)
            $table->string('company_name')->nullable();
            // Kapak foto (string olarak dosya yolu ya da URL saklanır)
            $table->string('cover_image')->nullable();

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('substations');
    }
};
