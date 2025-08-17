<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class SmsService
{
    protected $client;
    protected $clientNo;
    protected $userName;
    protected $password;
    protected $origin;
    protected $postUrl;
    protected $lang;
    protected $ext;

    public function __construct(Client $client = null)
    {
        $this->client = $client ?? new Client();
        $this->clientNo = env('SMS_CLIENT_NO');
        $this->userName = env('VATAN_SMS_USERNAME');
        $this->password = env('VATAN_SMS_PASSWORD');
        $this->origin = env('SMS_ORIGIN');
        $this->postUrl = env('SMS_API_URL', 'https://api.vatansms.net/api/v1/1toN');
        $this->lang = env('SMS_LANG', 'Turkce');
        $this->ext = env('SMS_EXT', 'com');
    }

    public function sendSingleSms($messageData)
    {
        $params = [
            "api_id" => $this->userName,
            "api_key" => $this->password,
            "sender" => $this->origin,
            "message_type" => "normal",
            "message" => $messageData->message,
            "message_content_type" => "bilgi",
            "phones" => [$messageData->phone]
        ];

        return $this->sendRequest($this->postUrl, $params);
    }

    public function sendMultipleSms(array $datas)
    {
        $postUrl = 'http://panel.vatansms.com/panel/smsgonderNNpost.php';

        $allMsg = implode('', array_map(fn($data) =>
        "<telmesaj><tel>{$data['phone']}</tel><mesaj>{$data['message']}</mesaj></telmesaj>",
            $datas
        ));

        $xmlString = 'data=<sms>
            <kno>' . $this->clientNo . '</kno>
            <kulad>' . $this->userName . '</kulad>
            <sifre>' . $this->password . '</sifre>
            <gonderen>' . $this->origin . '</gonderen>
            <telmesajlar>' . $allMsg . '</telmesajlar>
            <tur>' . $this->lang . '</tur>
        </sms>';

        return $this->sendRequest($postUrl, $xmlString);
    }

    private function sendRequest($url, $data)
    {
        try {
            $curl = curl_init();

            $curl_options = [
                CURLOPT_URL => $url,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT => 0,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_CUSTOMREQUEST => 'POST',
                CURLOPT_SSL_VERIFYPEER => 0,
                CURLOPT_POSTFIELDS => json_encode($data),
                CURLOPT_HTTPHEADER => [
                    'Content-Type: application/json'
                ]
            ];

            curl_setopt_array($curl, $curl_options);
            $response = curl_exec($curl);
            curl_close($curl);
            Log::channel('sms')->info("SMS API Response: " . $response);
            return $response;
        } catch (\Exception $e) {
            Log::error("SMS gönderme hatası: " . $e->getMessage());
            return false;
        }
    }
}
