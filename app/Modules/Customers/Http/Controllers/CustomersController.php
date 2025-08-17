<?php

namespace App\Modules\Customers\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Customers\Services\CustomersService;
use App\Modules\Customers\Http\Requests\CustomersRequest;
use App\Modules\Customers\Http\Resources\CustomersResource;
use App\Modules\Customers\Enums\StatusEnum;
use App\Modules\Customers\Enums\MessageTemplateEnum;
use App\Modules\Customers\Models\CustomerMessage;
use App\Services\SmsService;
use Illuminate\Http\JsonResponse;
use App\Traits\HandlesApiExceptions;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CustomersController extends Controller
{
    use HandlesApiExceptions;

    protected $customersService;

    public function __construct(CustomersService $customersService)
    {
        $this->customersService = $customersService;
    }

    public function index(): JsonResponse
    {
        $data = $this->customersService->all();
        $paginationData = [
          'total' => $data->total(),
          'per_page' => $data->perPage(),
          'current_page' => $data->currentPage(),
          'last_page' => $data->lastPage(),
          'from' => $data->firstItem(),
          'to' => $data->lastItem(),
        ];
        return $this->successResponse(CustomersResource::collection($data),$paginationData);
    }


    public function store(CustomersRequest $request): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($request) {
            $validatedData = $request->validated();
            $customers = $this->customersService->create($validatedData);
            return $this->createdResponse($customers);
        });
    }

    public function show($id): JsonResponse
    {
        $data = $this->customersService->find($id);
        return $this->successResponse(new CustomersResource($data));
    }

    public function update(CustomersRequest $request, $id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id, $request) {
            $validatedData = $request->validated();
            $customers = $this->customersService->update($id, $validatedData);
            return $this->updatedResponse($customers);
        });
    }

    /**
     * Update only the status of a customer
     * This endpoint bypasses the validation in CustomersRequest
     */
    public function update_status(Request $request, $id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id, $request) {
            // Get only the status from the request
            $statusData = ['status' => $request->input('status')];

            // Validate that the status is valid
            if (!$request->has('status') || !$request->input('status')) {
                return $this->errorResponse('Status field is required', 422);
            }

            // Update only the status field
            $customer = $this->customersService->update($id, $statusData);

            // Return the updated customer
            return $this->successResponse(new CustomersResource($customer));
        });
    }

    public function destroy($id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id) {
            $this->customersService->delete($id);
        return $this->deletedResponse();
        });
    }

    /**
     * Get all available statuses
     */
    public function statuses(): JsonResponse
    {
        return $this->successResponse(StatusEnum::toArray());
    }

    /**
     * Send an SMS message to a customer
     *
     * @param int $id Customer ID
     * @return JsonResponse
     */
    public function sendMessage(Request $request, $id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id, $request) {
            // Get the customer
            $customer = $this->customersService->find($id);

            if (!$customer) {
                return $this->errorResponse('Customer not found', 404);
            }

            // Check if a message was already sent today
            if (CustomerMessage::wasSentToday($id)) {
                return $this->errorResponse('A message has already been sent to this customer today', 422);
            }

            // Get the message template based on customer status
            $template = MessageTemplateEnum::getTemplateForStatus($customer->status->value);

            // Format the template with customer data
            $customerData = [
                'name' => $customer->name
                // No need to set date explicitly, the MessageTemplateEnum will use next Sunday's date by default
            ];
            $message = MessageTemplateEnum::formatTemplate($template, $customerData);

            // Get the message preview if requested
            if ($request->has('preview') && $request->input('preview')) {
                return $this->successResponse([
                    'message' => $message,
                    'customer' => new CustomersResource($customer)
                ]);
            }

            // Send the message
            $smsService = new SmsService();
            $messageData = (object)[
                'message' => $message,
                'phone' => $customer->phone_number
            ];

            $result = $smsService->sendSingleSms($messageData);

            // Log the result
            Log::channel('sms')->info("SMS sent to customer {$customer->id}: {$result}");

            // Record the message
            $customerMessage = new CustomerMessage([
                'customer_id' => $customer->id,
                'message' => $message,
                'sent_at' => now(),
                'status' => 'sent'
            ]);
            $customerMessage->save();

            return $this->successResponse([
                'message' => 'Message sent successfully',
                'customer' => new CustomersResource($customer)
            ]);
        });
    }

    /**
     * Check if a message was sent to a customer today
     *
     * @param int $id Customer ID
     * @return JsonResponse
     */
    public function checkMessageStatus($id): JsonResponse
    {
        return $this->handleApiExceptions(function () use ($id) {
            $wasSentToday = CustomerMessage::wasSentToday($id);

            return $this->successResponse([
                'sent_today' => $wasSentToday,
                'last_message' => $wasSentToday ? CustomerMessage::getLastMessage($id) : null
            ]);
        });
    }
}
