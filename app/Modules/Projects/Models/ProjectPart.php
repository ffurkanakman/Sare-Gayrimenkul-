<?php

namespace App\Modules\Projects\Models;

use Illuminate\Database\Eloquent\Model;
use App\Modules\Logs\Traits\LogsActivity;


class ProjectPart extends Model
{
    use LogsActivity;

    protected $table = 'project_parts';

    protected $fillable = [
        'project_id',
        'name',
        'quantity',
        'unit_price',
        'total_price',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships:

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
