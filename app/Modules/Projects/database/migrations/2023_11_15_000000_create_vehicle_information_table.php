<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('vehicle_information', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('projects')->onDelete('cascade');
            $table->string('brand');
            $table->string('model');
            $table->string('serial_number')->nullable();
            $table->string('chassis_number')->nullable();
            $table->integer('hours')->nullable();
            $table->integer('model_year')->nullable();
            $table->json('photos')->nullable(); // Store photo paths as JSON array
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicle_information');
    }
};
