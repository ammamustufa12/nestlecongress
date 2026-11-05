<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CongressEvent extends Model
{
    protected $fillable = ['kicker', 'title', 'meta', 'date_short'];
}
