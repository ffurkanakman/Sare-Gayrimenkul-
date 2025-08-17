<?php

namespace App\Modules\Customers\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'message',
        'sent_at',
        'status'
    ];

    protected $casts = [
        'sent_at' => 'datetime',
    ];

    /**
     * Get the customer that owns the message.
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customers::class, 'customer_id');
    }

    /**
     * Check if a message was sent to a customer today
     */
    public static function wasSentToday(int $customerId): bool
    {
        return self::where('customer_id', $customerId)
            ->whereDate('sent_at', today())
            ->exists();
    }

    /**
     * Get the last message sent to a customer
     */
    public static function getLastMessage(int $customerId)
    {
        return self::where('customer_id', $customerId)
            ->orderBy('sent_at', 'desc')
            ->first();
    }
}
