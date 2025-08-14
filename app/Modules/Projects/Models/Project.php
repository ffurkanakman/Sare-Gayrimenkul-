<?php

namespace App\Modules\Projects\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Modules\Logs\Traits\LogsActivity;

class Project extends Model
{
    use SoftDeletes, LogsActivity;

    protected $table = 'projects';

    protected $fillable = [
        'name',
        'description',
        'machine_info',
        'project_type',
        'price',
        'labor_cost',     // ✅ eklendi
        'discount',       // ✅ eklendi
        'debt',           // ✅ eklendi
        'status',
        'notes',
        'done_jobs',
        'client_id',
        'sales_person_id',
        'vehicle_id',
    ];


    protected $dates = ['deleted_at'];
    protected $casts = [
        'price' => 'decimal:2',
        'labor_cost' => 'decimal:2',
        'discount' => 'decimal:2',
        'debt' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships:

    public function client()
    {
        return $this->belongsTo(\App\Modules\Client\Models\Client::class);
    }

    public function salesPerson()
    {
        return $this->belongsTo(\App\Modules\User\Models\User::class, 'sales_person_id');
    }

    public function vehicleInformation()
    {
        return $this->hasOne(VehicleInformation::class);
    }

    public function parts()
    {
        return $this->hasMany(ProjectPart::class);
    }
}
