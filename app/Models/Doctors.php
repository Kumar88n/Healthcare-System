<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Doctors extends Model
{
    protected $casts = [
        'availability' => 'array',
        'emergency_schedule' => 'array',
    ];
}
