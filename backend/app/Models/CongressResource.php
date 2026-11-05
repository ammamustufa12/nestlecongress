<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CongressResource extends Model
{
    protected $fillable = ['kind', 'title', 'detail', 'size', 'icon', 'tint', 'sort'];
}
