<?php

namespace App\Modules\Substation\Observers;

use App\Modules\Substation\Models\Substation;

class SubstationObserver
{
    public function created(Substation $model)
    {
        // Oluşturma işlemi gözlemlendi
    }

    public function updated(Substation $model)
    {
        // Güncelleme işlemi gözlemlendi
    }

    public function deleted(Substation $model)
    {
        // Silme işlemi gözlemlendi
    }
}