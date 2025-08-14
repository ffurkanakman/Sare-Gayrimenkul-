<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();

            $table->string('name')->unique(); // PRJ-1234
            $table->text('description')->nullable();
            $table->string('machine_info');
            $table->string('project_type'); // Construction, Repair, etc.
            $table->decimal('price', 15, 2)->nullable();
            $table->decimal('labor_cost', 15, 2)->nullable();
            $table->decimal('discount', 15, 2)->nullable();
            $table->decimal('debt', 15, 2)->nullable();

            $table->enum('status', ['pending', 'approved', 'rejected', 'in_progress', 'completed'])->default('pending');

            $table->text('notes')->nullable(); // Tasks to be done
            $table->text('done_jobs')->nullable(); // Completed tasks

            $table->foreignId('client_id')->nullable()->constrained('clients')->onDelete('set null');
            $table->foreignId('sales_person_id')->nullable()->constrained('users')->onDelete('set null');

            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
