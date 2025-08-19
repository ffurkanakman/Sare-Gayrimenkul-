<?php

namespace App\Modules\Substation\Models;

use Illuminate\Database\Eloquent\Model;


class Substation extends Model
{


    protected $table = 'substations';
    protected $fillable = ['company_name', 'cover_image'];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}
