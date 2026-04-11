<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Medication extends Model
{
    //
    protected $guarded = ['id'];
    
    public function residence(){
        return $this->belongsTo(Residence::class);
    }
    public function prescriptions(){
        return $this->hasMany(Prescription::class);
    }
}
