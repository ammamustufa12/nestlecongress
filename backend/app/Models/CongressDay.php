<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CongressDay extends Model
{
    protected $fillable = ['code', 'label', 'date_label', 'heading', 'subtitle', 'sort'];

    public function sessions(): HasMany
    {
        return $this->hasMany(AgendaSession::class);
    }
}
