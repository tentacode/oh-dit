<?php

declare(strict_types=1);

namespace App\Infrastructure\Symfony\ErrorHandling;

use function Sentry\captureException;
use LogicException;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\HttpFoundation\Exception\SuspiciousOperationException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Validator\Exception\ValidationFailedException;
use Throwable;
use Webmozart\Assert\Assert;

#[AsEventListener(event: KernelEvents::EXCEPTION)]
final class ExceptionListener
{
    public const UNPROCESSABLE_ENTITY_CODE = 'unprocessable_entity';

    public const INTERNAL_SERVER_ERROR_CODE = 'internal_server_error';

    public const NOT_FOUND = 'not_found';

    public const BAD_REQUEST = 'bad_request';

    public function onKernelException(ExceptionEvent $event): void
    {
        $exception = $event->getThrowable();

        if ($exception instanceof BadRequestHttpException) {
            if ($exception->getPrevious() instanceof SuspiciousOperationException) {
                // SuspiciousOperationException should not be exposed to the client
                $exception = new LogicException('Suspicious operation should always be handled.', 0, $exception);
                captureException($exception);

                $event->setResponse($this->createDefaultErrorResponse());
                return;
            }

            $event->setResponse($this->createBadRequestErrorResponse($exception));
            return;
        }

        if ($exception instanceof UnprocessableEntityHttpException) {
            $event->setResponse($this->createValidationErrorResponse($exception));
            return;
        }

        if ($exception instanceof NotFoundHttpException) {
            $event->setResponse($this->createNotFoundErrorResponse());
            return;
        }

        if ($_SERVER['APP_ENV'] === 'dev') {
            $event->setResponse($this->createDefaultDevelopmentErrorResponse($exception));
            return;
        }

        captureException($exception);
        $event->setResponse($this->createDefaultErrorResponse());
    }

    private function createValidationErrorResponse(UnprocessableEntityHttpException $exception): JsonResponse
    {
        $responseBody = [
            'code' => self::UNPROCESSABLE_ENTITY_CODE,
            'message' => 'Validation Failed',
        ];

        $validationFailedException = $exception->getPrevious();
        Assert::isInstanceOf($validationFailedException, ValidationFailedException::class);

        foreach ($validationFailedException->getViolations() as $violation) {
            $responseBody['errors'][] = [
                'code' => $violation->getCode(),
                'propertyPath' => $violation->getPropertyPath(),
                'message' => $violation->getMessage(),
            ];
        }

        return new JsonResponse($responseBody, Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    private function createNotFoundErrorResponse(): JsonResponse
    {
        return new JsonResponse(
            [
                'code' => self::NOT_FOUND,
                'message' => 'Resource not found.',
            ],
            Response::HTTP_NOT_FOUND,
        );
    }

    private function createBadRequestErrorResponse(BadRequestHttpException $exception): JsonResponse
    {
        return new JsonResponse(
            [
                'code' => self::BAD_REQUEST,
                'message' => $exception->getMessage(),
            ],
            Response::HTTP_BAD_REQUEST,
        );
    }

    private function createDefaultErrorResponse(): JsonResponse
    {
        return new JsonResponse(
            [
                'code' => self::INTERNAL_SERVER_ERROR_CODE,
                'message' => 'An error occurred.',
            ],
            Response::HTTP_INTERNAL_SERVER_ERROR,
        );
    }

    private function createDefaultDevelopmentErrorResponse(Throwable $exception): JsonResponse
    {
        $errorCode = $exception instanceof HttpExceptionInterface
            ? $exception->getStatusCode()
            : $exception->getCode();

        return new JsonResponse(
            [
                'code' => self::INTERNAL_SERVER_ERROR_CODE,
                'message' => 'An error occurred.',
                'exception_class' => get_class($exception),
                'exception_code' => $errorCode ?: self::INTERNAL_SERVER_ERROR_CODE,
                'exception_message' => $exception->getMessage(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
                'trace' => $exception->getTrace(),
            ],
            Response::HTTP_INTERNAL_SERVER_ERROR,
        );
    }
}
