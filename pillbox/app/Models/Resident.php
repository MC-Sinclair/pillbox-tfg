<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Resident extends Model
{
    use HasFactory;

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'birth_date' => 'date',
        ];
    }

    public function residence(){
        return $this->belongsTo(Residence::class);
    }
    public function prescriptions(){
        return $this->hasMany(Prescription::class);
    }
    public function users(){
        return $this->belongsToMany(User::class);
    }
}
