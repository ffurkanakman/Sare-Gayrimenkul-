<?php

namespace App\Services;

use App\Events\NotificationBroadcast;
use App\Modules\Notifications\Services\NotificationsService;
use App\Modules\User\Models\User;

class NotificationDispatcherService
{
    protected NotificationsService $notificationsService;
    protected MailNotificationService $mailNotificationService;
    protected SmsNotificationService $smsNotificationService;

    public function __construct(
        NotificationsService $notificationsService,
        MailNotificationService $mailNotificationService,
        SmsNotificationService $smsNotificationService
    ) {
        $this->notificationsService = $notificationsService;
        $this->mailNotificationService = $mailNotificationService;
        $this->smsNotificationService = $smsNotificationService;
    }

    public function dispatchNotification($userId, $message, $type = 'database'): void
    {
        $notification = $this->notificationsService->createNotification($userId, $message, $type);

        $this->broadcastNotification($notification);

        $this->sendIfNeeded($notification);
    }

    protected function broadcastNotification($notification): void
    {
        broadcast(new NotificationBroadcast($notification));
    }

    protected function sendIfNeeded($notification): void
    {
        $user = $notification->user ?? User::find($notification->user_id);

        if (!$user) return;

        if ($user->notificationPreferences->email_notifications ?? false) {
            $this->mailNotificationService->send($notification);
        }

        if ($user->notificationPreferences->sms_notifications ?? false) {
            $this->smsNotificationService->send($notification);
        }
    }
}
