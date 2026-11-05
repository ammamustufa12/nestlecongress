<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = [
        'user_id', 'author_name', 'topic', 'status', 'votes', 'body', 'bucket', 'sort',
    ];
}
