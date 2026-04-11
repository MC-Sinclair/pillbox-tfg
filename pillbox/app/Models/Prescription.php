<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Prescription extends Model
{
    //
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
