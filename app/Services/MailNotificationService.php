<?php

namespace App\Services;

use App\Mail\NotificationMailer;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class MailNotificationService
{
    public function send($notification): void
    {
        $email = $notification->user?->email;

        if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            Log::warning('E-posta gönderilemedi: Geçersiz veya boş e-posta.', [
                'user_id' => $notification->user?->id,
                'email'   => $email,
            ]);
            return;
        }

        try {
            Mail::to($email)->send(new NotificationMailer($notification));
        } catch (\Throwable $e) {
            Log::error('E-posta gönderim hatası: ' . $e->getMessage(), [
                'user_id' => $notification->user?->id,
                'email'   => $email,
            ]);
        }
    }
}
