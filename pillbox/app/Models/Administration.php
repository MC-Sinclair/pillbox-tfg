<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Administration extends Model
{
    //
    public function prescription(){
        return $this->belongsTo(Prescription::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }
}
