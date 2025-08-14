<?php

namespace App\Modules\Client\Models;

use App\Modules\Projects\Models\Project;
use Illuminate\Database\Eloquent\Model;
use App\Modules\Logs\Traits\LogsActivity;


class Client extends Model
{
    use LogsActivity;

    protected $table = 'clients';
    protected $fillable = [
        'company_name',
        'authorized_person',
        'phone',
        'address',
        'email',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function projects()
    {
        return $this->hasMany(Project::class);
    }
}
