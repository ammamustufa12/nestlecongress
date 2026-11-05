<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Poll extends Model
{
    protected $fillable = ['tag', 'question', 'sort'];

    public function options(): HasMany
    {
        return $this->hasMany(PollOption::class)->orderBy('sort');
    }
}
