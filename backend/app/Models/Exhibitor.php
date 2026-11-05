<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exhibitor extends Model
{
    protected $fillable = ['name', 'booth', 'focus', 'sort'];
}
