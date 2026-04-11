<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Residence extends Model
{
    //
    protected $guarded = ['id'];

    public function users(){
        return $this->hasMany(User::class);
    }
    public function residents(){
        return $this->hasMany(Resident::class);
    }
    public function medications(){
        return $this->hasMany(Medication::class);
    }
}
