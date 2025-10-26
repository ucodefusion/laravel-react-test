<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('working_hours', function (Blueprint $table) {
            $table->id();
            $table->morphs('workable');
            $table->unsignedTinyInteger('weekday');
            $table->time('open_at');
            $table->time('close_at');
            $table->string('timezone')->default('Pacific/Auckland');
            $table->timestamps();
            $table->unique(['workable_type', 'workable_id', 'weekday']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('working_hours');
    }
};
