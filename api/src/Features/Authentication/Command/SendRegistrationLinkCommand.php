<?php

declare(strict_types=1);

namespace App\Features\Authentication\Command;

use Brevo\Client\Api\TransactionalEmailsApi;
use Brevo\Client\Configuration;
use Brevo\Client\Model\SendSmtpEmail;
use GuzzleHttp\Client;
use Webmozart\Assert\Assert;

class SendRegistrationLinkCommand
{
    private const int INVITE_TEMPLATE_ID = 8;

    public function __invoke(
        string $email,
    ): void {
        Assert::email($email);

        Assert::notEmpty($_ENV['BREVO_API_KEY'], 'Brevo API key is not set in environment variables.');
        Assert::notEq($_ENV['BREVO_API_KEY'], 'CHANGE_ME', 'You still have CHANGE_ME in your .env file for the Brevo API key.');
        Assert::string($_ENV['BREVO_API_KEY'], 'Brevo API key must be a string.');

        $brevoConfig = Configuration::getDefaultConfiguration()
            ->setApiKey('api-key', $_ENV['BREVO_API_KEY']);

        Assert::string($_SERVER['FRONTEND_APP_HOST'], 'FRONTEND_APP_HOST is not set in server variables.');

        $betaRegistrationUrl = sprintf(
            '%s/inscription/beta?token=%s',
            rtrim($_SERVER['FRONTEND_APP_HOST'], '/'),
            $this->generateToken($email)
        );

        $sendSmtpEmail = new SendSmtpEmail([
            'to' => [
                [
                    'email' => $email,
                ],
            ],
            'templateId' => self::INVITE_TEMPLATE_ID,
            'params' => [
                'beta_registration_url' => $betaRegistrationUrl,
            ],
        ]);

        $transactionalEmailsApi = new TransactionalEmailsApi(
            new Client(),
            $brevoConfig
        );

        $transactionalEmailsApi->sendTransacEmail($sendSmtpEmail);
    }

    private function generateToken(string $email): string
    {
        Assert::string($_SERVER['APP_SECRET'], 'APP_SECRET is not set in server variables.');

        $payload = base64_encode($email);
        $signature = hash_hmac('sha256', $payload, $_SERVER['APP_SECRET']);

        return $payload . '.' . $signature;
    }
}
