<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Modules\User\Models\User;
use Illuminate\Support\Facades\DB;

class UpdateUserPerformance extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:update-performance';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update user performance coefficients based on sales';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Updating user performance coefficients...');

        // Get all users with their sales performance for the last month
        $users = User::select('users.id', 'users.name',
                DB::raw('(SELECT COUNT(*) FROM customers
                          WHERE customers.manager_id = users.id
                          AND customers.status = "saled"
                          AND customers.updated_at >= DATE_SUB(NOW(), INTERVAL 1 MONTH)) as monthly_sales'),
                'users.performance_coefficient as previous_coefficient'
            )
            ->get();

        // Calculate total sales for the month
        $totalSales = $users->sum('monthly_sales');

        // Update performance coefficients
        foreach ($users as $user) {
            // Calculate new coefficient: (Sales Count / Total Sales) × 0.7 + (Previous Coefficient) × 0.3
            $newCoefficient = ($totalSales > 0 ? ($user->monthly_sales / $totalSales) * 0.7 : 0)
                            + ($user->previous_coefficient ?? 0.1) * 0.3;

            // Update user
            User::where('id', $user->id)->update([
                'performance_coefficient' => $newCoefficient
            ]);

            $this->info("Updated {$user->name}: " . ($user->previous_coefficient ?? 0.1) . " -> {$newCoefficient}");
        }

        $this->info('Performance coefficients updated successfully!');
    }
}
