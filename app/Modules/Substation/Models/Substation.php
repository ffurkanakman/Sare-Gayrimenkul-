<?php

namespace App\Modules\Substation\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Substation extends Model
{
    use SoftDeletes;

    protected $table = 'substations';
    protected $fillable = ['name'];
    protected $dates = ['deleted_at'];
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}