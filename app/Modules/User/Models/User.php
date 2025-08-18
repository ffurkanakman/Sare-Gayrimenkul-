<?php

namespace App\Modules\User\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name','surname','phone_number','email','password','status','role','pic','performance_coefficient'
    ];

    protected $hidden = ['password','remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'performance_coefficient' => 'float',
        'status' => 'boolean',
    ];


    // App/Modules/User/Models/User.php

    protected $appends = ['avatar_url'];

    public function getAvatarUrlAttribute(): ?string
    {
        if (!$this->pic) return null;

        // DB’de URL varsa (/storage/...)
        if (str_starts_with($this->pic, '/storage/')) {
            return url($this->pic);
        }

        // DB’de path varsa (avatars/...)
        return asset('storage/'.$this->pic);
    }

}
