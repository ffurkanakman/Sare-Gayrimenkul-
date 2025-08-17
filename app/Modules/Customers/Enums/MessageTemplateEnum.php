<?php

namespace App\Modules\Customers\Enums;

enum MessageTemplateEnum: string
{
    case PENDING = 'pending';
    case APPOINTMENT = 'appointment';
    case TRANSACTION = 'transaction';
    case SALED = 'saled';
    case NO_SALED = 'no_saled';
    case CANCELED = 'canceled';

    /**
     * Get the message template for the enum value
     */
    public function template(): string
    {
        return match($this) {
            self::PENDING => 'Sayın {name}, Sare Arsa & Gayrimenkul olarak bizimle iletişime geçtiniz için teşekkür ederiz. Müşteri temsilcileri en kısa sürede size ulaşacaktır.',
            self::APPOINTMENT => 'Sayın {name}, Sare Arsa & Gayrimenkul ile randevunuz onaylanmıştır. Randevu tarihiniz: {date}. Yeriniz ayrılmıştır. Sorularınız için bize ulaşabilirsiniz. Mehmet bey ve ekibiz sizi bekliyor 🙏',
            self::TRANSACTION => 'Sayın {name}, Sare Arsa & Gayrimenkul ile işleminiz devam etmektedir. Sizi en kısa sürede bütçeniz dahilinde görüşmek üzere ofisimize bekliyoruz. Gelmeden önce müşteri temsilciniz ile randevulaşmayı unutmayınız.',
            self::SALED => 'Sayın {name}, Sare Arsa & Gayrimenkul ile gerçekleştirdiğiniz satış işlemi tamamlanmıştır. Bizi tercih ettiğiniz için teşekkür ederiz.',
            self::NO_SALED => 'Sayın {name}, Sare Arsa & Gayrimenkul ile görüşmeniz sonucunda satış işlemi gerçekleşmemiştir. Başka bir fırsatta sizinle çalışmayı umuyoruz. Şimdilik hoşçakalın.',
            self::CANCELED => 'Sayın {name}, Sare Arsa & Gayrimenkul ile randevunuz iptal edilmiştir. Yeni bir randevu için bize ulaşabilirsiniz.',
        };
    }

    /**
     * Get the message template for a specific status
     */
    public static function getTemplateForStatus(string $status): string
    {
        $enum = self::tryFrom($status);

        if ($enum === null) {
            return 'Sayın {name}, Sare Gayrimenkul\'den mesajınız var.';
        }

        return $enum->template();
    }

    /**
     * Get the next Sunday's date
     *
     * @return string Formatted date (d.m.Y)
     */
    public static function getNextSundayDate(): string
    {
        $date = new \DateTime();
        $dayOfWeek = (int)$date->format('w'); // 0 (Sunday) to 6 (Saturday)

        // If today is Sunday, get next Sunday (add 7 days)
        // Otherwise, add days needed to reach next Sunday
        $daysToAdd = $dayOfWeek === 0 ? 7 : 7 - $dayOfWeek;

        $date->modify("+{$daysToAdd} days");
        return $date->format('d.m.Y');
    }

    /**
     * Format the template with customer data
     */
    public static function formatTemplate(string $template, array $customerData): string
    {
        $formattedTemplate = $template;

        // Replace {name} with customer name
        if (isset($customerData['name'])) {
            $formattedTemplate = str_replace('{name}', $customerData['name'], $formattedTemplate);
        }

        // Replace {date} with next Sunday's date if not provided
        $date = $customerData['date'] ?? self::getNextSundayDate();
        $formattedTemplate = str_replace('{date}', $date, $formattedTemplate);

        return $formattedTemplate;
    }
}
