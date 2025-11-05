<?php

namespace App\Features\Newsletter\Command;

use Brevo\Client\Api\ContactsApi;
use Brevo\Client\Configuration;
use Brevo\Client\Model\CreateContact;

class AddToBrevoCommand
{
    private const int BETA_LIST_ID = 4;
    private const int NEWSLETTER_LIST_ID = 6;
    private const int BLOG_LIST_ID = 5;

    public function __construct()
    {
    }

    public function __invoke(BrevoNewsletter $brevoNewsletter): void
    {
        if (!$brevoNewsletter->atLeastOneConsent()) {
            throw new \InvalidArgumentException("At least one consent must be given.");
        }

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

        $contact = new CreateContact([
            'email' => $brevoNewsletter->email,
            'listIds' => $lists,
            'updateEnabled' => true,
        ]);

        $contactsApi->createContact($contact);
    }
}
