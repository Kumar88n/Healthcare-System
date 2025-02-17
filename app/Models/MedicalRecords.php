<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MedicalRecords extends Model
{
    protected $casts = [
        'record_details' => 'array',
    ];
}
