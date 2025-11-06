<?php

declare(strict_types=1);

namespace App\Features\Newsletter\Command;

use Brevo\Client\Api\ContactsApi;
use Brevo\Client\Configuration;
use Brevo\Client\Model\CreateContact;
use InvalidArgumentException;
use Webmozart\Assert\Assert;

class AddToBrevoCommand
{
    private const int BETA_LIST_ID = 4;

    private const int NEWSLETTER_LIST_ID = 6;

    private const int BLOG_LIST_ID = 5;

    public function __invoke(BrevoNewsletter $brevoNewsletter): void
    {
        if (! $brevoNewsletter->atLeastOneConsent()) {
            throw new InvalidArgumentException('At least one consent must be given.');
        }

        Assert::notEmpty($_ENV['BREVO_API_KEY'], 'Brevo API key is not set in environment variables.');
        Assert::notEq($_ENV['BREVO_API_KEY'], 'CHANGE_ME', 'You still have CHANGE_ME in your .env file for the Brevo API key.');
        Assert::string($_ENV['BREVO_API_KEY'], 'Brevo API key must be a string.');

        $brevoConfig = Configuration::getDefaultConfiguration()
            ->setApiKey('api-key', $_ENV['BREVO_API_KEY']);

        $contactsApi = new ContactsApi(null, $brevoConfig);

        $lists = [];
        if ($brevoNewsletter->consentBeta) {
            $lists[] = self::BETA_LIST_ID;
        }

        if ($brevoNewsletter->consentNewsletter) {
            $lists[] = self::NEWSLETTER_LIST_ID;
        }

        if ($brevoNewsletter->consentBlog) {
            $lists[] = self::BLOG_LIST_ID;
        }

        $createContact = new CreateContact([
            'email' => $brevoNewsletter->email,
            'listIds' => $lists,
            'updateEnabled' => true,
        ]);

        $contactsApi->createContact($createContact);
    }
}
