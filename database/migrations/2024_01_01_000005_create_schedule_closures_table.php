<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('schedule_closures', function (Blueprint $table) {
            $table->id();
            $table->morphs('closable');
            $table->date('closed_on');
            $table->string('reason')->nullable();
            $table->timestamps();
            $table->unique(['closable_type', 'closable_id', 'closed_on']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('schedule_closures');
    }
};
