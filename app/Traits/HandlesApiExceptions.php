<?php

namespace App\Traits;

use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;

trait HandlesApiExceptions
{
    /**
     * Genel API hatalarını merkezi olarak yönetir.
     *
     * @param \Closure $callback
     * @return \Illuminate\Http\JsonResponse
     */
    protected function handleApiExceptions(\Closure $callback)
    {
        try {
            return $callback();
        } catch (ValidationException $e) {
            return $this->errorResponse(
                'Validasyon hatası oluştu',
                Response::HTTP_UNPROCESSABLE_ENTITY,
                $e->errors()
            );
        } catch (AuthorizationException $e) {
            return $this->errorResponse(
                'Yetkilendirme başarısız',
                Response::HTTP_FORBIDDEN,
                ['error' => $e->getMessage()]
            );
        } catch (ModelNotFoundException $e) {
            return $this->errorResponse(
                'Kayıt bulunamadı',
                Response::HTTP_NOT_FOUND,
                ['error' => $e->getMessage()]
            );
        } catch (HttpException $e) {
            return $this->errorResponse(
                $e->getMessage(),
                $e->getStatusCode(),
                ['error' => $e->getMessage()]
            );
        } catch (\Exception $e) {
            return $this->errorResponse(
                'Beklenmedik bir hata oluştu',
                Response::HTTP_INTERNAL_SERVER_ERROR,
                ['error' => $e->getMessage()]
            );
        }
    }

    /**
     * Başarısız response üretir (Controller ile uyumlu).
     */
    protected function errorResponse(string $message, int $status = Response::HTTP_BAD_REQUEST, $errors = null): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'status' => false,
            'message' => $message,
            'errors' => $errors,
        ], $status);
    }

    /**
     * Başarılı response üretir (Controller ile imza uyumlu)
     */
    protected function successResponse($data, $paginationData = null, int $status = Response::HTTP_OK): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'status' => true,
            'message' => 'İşlem başarılı',
            'data' => $data,
            'pagination' => $paginationData,
        ], $status);
    }

    /**
     * Kayıt oluşturma işlemi için response
     */
    protected function createdResponse($data = null, string $message = 'Kayıt oluşturuldu'): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'status' => true,
            'message' => $message,
            'data' => $data,
        ], Response::HTTP_CREATED);
    }

    /**
     * Güncelleme işlemi için response
     */
    protected function updatedResponse($data = null, string $message = 'Güncelleme başarılı'): \Illuminate\Http\JsonResponse
    {
        return $this->successResponse($data);
    }

    /**
     * Silme işlemi için response
     */
    protected function deletedResponse(string $message = 'Silme işlemi başarılı'): \Illuminate\Http\JsonResponse
    {
        return response()->json([
            'status' => true,
            'message' => $message,
        ]);
    }
}
