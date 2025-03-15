<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Doctors extends Model
{

    protected $casts = [
        'availability' => 'array',
        'emergency_schedule' => 'array',
        'emergency_available' => 'boolean',
    ];

    protected $fillable = [
        'user_id',
        'name',
        'specialty',
        'department',
        'fee',
        'availability',
        'emergency_fee',
        'emergency_available',
        'emergency_schedule',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
