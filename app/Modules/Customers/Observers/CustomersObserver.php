<?php

namespace App\Modules\Customers\Observers;

use App\Modules\Customers\Models\Customers;

class CustomersObserver
{
    public function created(Customers $model)
    {
        // Oluşturma işlemi gözlemlendi
    }

    public function updated(Customers $model)
    {
        // Güncelleme işlemi gözlemlendi
    }

    public function deleted(Customers $model)
    {
        // Silme işlemi gözlemlendi
    }
}