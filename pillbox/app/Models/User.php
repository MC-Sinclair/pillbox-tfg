<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'email_verified_at'       => 'datetime',
            'two_factor_confirmed_at' => 'datetime',
            'password'                => 'hashed',
            'active'                  => 'boolean',
        ];
    }

    public function residence(){
        return $this->belongsTo(Residence::class);
    }

    public function prescriptions(){
        return $this->hasMany(Prescription::class);
    }

    public function administrations(){
        return $this->hasMany(Administration::class);
    }

    public function residents(){
        return $this->belongsToMany(Resident::class);
    }
    
}
