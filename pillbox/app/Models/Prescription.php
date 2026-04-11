<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prescription extends Model
{
    //
    protected $guarded = ['id'];

    protected function casts(): array{
        return [
            'schedules'  => 'array',
            'start_date' => 'date',
            'end_date'   => 'date',
            'active'     => 'boolean',
        ];
    }

    public function resident(){
        return $this->belongsTo(Resident::class);
    }

    public function medication(){
        return $this->belongsTo(Medication::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function administrations(){
        return $this->hasMany(Administration::class);
    }
}
