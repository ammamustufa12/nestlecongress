<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PollVote extends Model
{
    public $timestamps = false;

    protected $fillable = ['user_id', 'poll_id', 'poll_option_id'];
}
