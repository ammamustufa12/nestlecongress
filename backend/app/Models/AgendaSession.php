<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AgendaSession extends Model
{
    protected $fillable = ['congress_day_id', 'time', 'period', 'tag', 'title', 'meta', 'sort'];

    public function day(): BelongsTo
    {
        return $this->belongsTo(CongressDay::class, 'congress_day_id');
    }
}
