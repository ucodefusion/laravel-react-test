<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class ScheduleClosure extends Model
{
    use HasFactory;

    protected $fillable = [
        'closable_type',
        'closable_id',
        'closed_on',
        'reason',
    ];

    protected $casts = [
        'closed_on' => 'date',
    ];

    public function closable(): MorphTo
    {
        return $this->morphTo();
    }
}
