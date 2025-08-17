<?php

namespace App\Modules\Customers\Enums;

enum StatusEnum: string
{
    case PENDING = 'pending';
    case APPOINTMENT = 'appointment';
    case TRANSACTION = 'transaction';
    case SALED = 'saled';
    case NO_SALED = 'no_saled';
    case CANCELED = 'canceled';

    /**
     * Get the label for the enum value
     */
    public function label(): string
    {
        return match($this) {
            self::PENDING => 'İletişim Bekliyor',
            self::APPOINTMENT => 'Randevu Alındı',
            self::TRANSACTION => 'İşlem Bekleniyor',
            self::SALED => 'Satış Tamamlandı',
            self::NO_SALED => 'Satış Gerçekleşmedi',
            self::CANCELED => 'Randevu Alınamadı',
        };
    }

    /**
     * Get the badge for the enum value for front
     */
    public function badge(): string
    {
        return match($this) {
            self::PENDING => 'badge-light-secondary',
            self::APPOINTMENT => 'badge-success',
            self::TRANSACTION => 'badge-fsh-primary',
            self::SALED => 'badge-primary',
            self::NO_SALED => 'badge-light-danger',
            self::CANCELED => 'badge-danger',
        };
    }

    /**
     * Get all enum values as an array
     */
    public static function toArray(): array
    {
        return [
            self::PENDING->value => ['label' => self::PENDING->label(), 'badge' => self::PENDING->badge()],
            self::APPOINTMENT->value => ['label' => self::APPOINTMENT->label(), 'badge' => self::APPOINTMENT->badge()],
            self::TRANSACTION->value => ['label' => self::TRANSACTION->label(), 'badge' => self::TRANSACTION->badge()],
            self::SALED->value => ['label' => self::SALED->label(), 'badge' => self::SALED->badge()],
            self::NO_SALED->value => ['label' => self::NO_SALED->label(), 'badge' => self::NO_SALED->badge()],
            self::CANCELED->value => ['label' => self::CANCELED->label(), 'badge' => self::CANCELED->badge()],
        ];
    }
}
