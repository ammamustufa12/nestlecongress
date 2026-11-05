<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Speaker extends Model
{
    protected $fillable = [
        'name', 'role', 'place', 'talk', 'field', 'initials',
        'featured', 'color_start', 'color_end', 'sort', 'bio',
    ];

    protected function casts(): array
    {
        return ['featured' => 'boolean'];
    }
}
