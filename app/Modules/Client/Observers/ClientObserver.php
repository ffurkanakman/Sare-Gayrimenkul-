<?php

namespace App\Modules\Client\Observers;

use App\Modules\Client\Models\Client;

class ClientObserver
{
    public function created(Client $model)
    {
        // Oluşturma işlemi gözlemlendi
    }

    public function updated(Client $model)
    {
        // Güncelleme işlemi gözlemlendi
    }

    public function deleted(Client $model)
    {
        // Silme işlemi gözlemlendi
    }
}