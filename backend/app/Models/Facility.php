<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Facility extends Model
{
    public $timestamps = false;

    protected $fillable = ['venue_id', 'label', 'icon', 'sort'];
}
