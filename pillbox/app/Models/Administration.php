<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Administration extends Model
{
    //
    protected $guarded = ['id'];
    const UPDATED_AT = null;
    protected function casts(): array{
        return [
            'scheduled_at'    => 'datetime',
            'administered_at' => 'datetime',
        ];
    }
    public function prescription(){
        return $this->belongsTo(Prescription::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }
}
