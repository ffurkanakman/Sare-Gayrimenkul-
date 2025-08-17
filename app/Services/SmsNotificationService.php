<?php

namespace App\Services;

use App\Services\SmsService;
use Illuminate\Support\Facades\Log;

class SmsNotificationService
{
    protected SmsService $smsService;

    public function __construct(SmsService $smsService)
    {
        $this->smsService = $smsService;
    }

    public function send($notification): void
    {
        try {
            $this->smsService->sendSingleSms($notification);
        } catch (\Throwable $e) {
            Log::error('SMS gönderimi başarısız: ' . $e->getMessage(), [
                'notification_id' => $notification->id ?? null,
            ]);
        }
    }
}
