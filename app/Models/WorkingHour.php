<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class WorkingHour extends Model
{
    use HasFactory;

    protected $fillable = [
        'workable_type',
        'workable_id',
        'weekday',
        'open_at',
        'close_at',
        'timezone',
    ];

    public function workable(): MorphTo
    {
        return $this->morphTo();
    }
}
