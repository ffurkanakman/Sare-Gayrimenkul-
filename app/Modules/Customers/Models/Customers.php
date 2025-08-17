<?php

namespace App\Modules\Customers\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Modules\User\Models\User;
use App\Modules\Customers\Enums\StatusEnum;

class Customers extends Model
{
    use SoftDeletes;

    protected $table = 'customers';
    protected $fillable = ['name', 'surname', 'phone_number','status', 'description', 'manager_id'];
    protected $dates = ['deleted_at'];
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'status' => StatusEnum::class,
    ];

    /**
     * Boot method for the model.
     */
    protected static function boot()
    {
        parent::boot();

        // Assign a user to 'manager_id' on creation using the algorithm
        static::creating(function ($customer) {
            if (is_null($customer->manager_id)) {
                $customer->manager_id = self::assignUserWithAlgorithm();
            }
        });
    }

    /**
     * Assign a user based on the performance algorithm
     *
     * @return int|null User ID to assign as manager
     */
    protected static function assignUserWithAlgorithm()
    {
        // Get all users with their sales performance
        $users = User::select('users.id', 'users.name',
                \DB::raw('(SELECT COUNT(*) FROM customers WHERE customers.manager_id = users.id AND customers.status = "saled") as sales_count'),
                'users.performance_coefficient'
            )
            ->get();

        // If no users, return null
        if ($users->isEmpty()) {
            return null;
        }

        // Calculate total sales
        $totalSales = $users->sum('sales_count');

        // Calculate scores for each user
        $userScores = [];
        $totalScore = 0;

        foreach ($users as $user) {
            // Get previous performance coefficient (default to 0.1 if not set)
            $previousPerformance = $user->performance_coefficient ?? 0.1;

            // Calculate score: (Sales Count / Total Sales) × 0.7 + (Previous Performance) × 0.3
            $score = ($totalSales > 0 ? ($user->sales_count / $totalSales) * 0.7 : 0) + $previousPerformance * 0.3;

            $userScores[$user->id] = $score;
            $totalScore += $score;
        }

        // If no scores (shouldn't happen), return random user
        if ($totalScore <= 0) {
            return User::inRandomOrder()->first()?->id;
        }

        // Normalize scores to create a probability distribution
        $probabilities = [];
        foreach ($userScores as $userId => $score) {
            $probabilities[$userId] = $score / $totalScore;
        }

        // Select a user based on weighted probability
        $random = mt_rand() / mt_getrandmax(); // Random number between 0 and 1
        $cumulativeProbability = 0;

        foreach ($probabilities as $userId => $probability) {
            $cumulativeProbability += $probability;

            if ($random <= $cumulativeProbability) {
                return $userId;
            }
        }

        // Fallback to the user with highest score if something goes wrong
        return array_search(max($userScores), $userScores);
    }




    /**
     * Get the user that manages this customer.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    /**
     * Get information about the manager of this customer.
     *
     * @return array|null Manager information or null if no manager is assigned
     */
    public function getManagerInfo()
    {
        if (!$this->user) {
            return null;
        }

        return [
            'id' => $this->user->id,
            'name' => $this->user->name,
            'surname' => $this->user->surname,
            'email' => $this->user->email,
            'phone_number' => $this->user->phone_number,
            'pic' => $this->user->pic,
        ];
    }
}
