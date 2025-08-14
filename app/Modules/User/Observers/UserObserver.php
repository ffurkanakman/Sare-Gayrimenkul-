<?php

namespace App\Modules\User\Observers;

use App\Modules\User\Models\User;

class UserObserver
{
    public function created(User $model)
    {
        // Oluşturma işlemi gözlemlendi
    }

    public function updated(User $model)
    {
        // Güncelleme işlemi gözlemlendi
    }

    public function deleted(User $model)
    {
        // Silme işlemi gözlemlendi
    }
}