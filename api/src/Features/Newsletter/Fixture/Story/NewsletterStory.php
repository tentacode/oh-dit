<?php

declare(strict_types=1);

namespace App\Features\Newsletter\Fixture\Story;

use App\Features\Newsletter\Fixture\Factory\NewsletterFactory;
use Zenstruck\Foundry\Attribute\AsFixture;
use Zenstruck\Foundry\Story;

#[AsFixture(name: 'newsletter', groups: ['all'])]
final class NewsletterStory extends Story
{
    public const EXISTING_NEWSLETTER_UUID = '00000000-0000-0000-0000-000000000001';

    public function build(): void
    {
        NewsletterFactory::createOne([
            'uuid' => self::EXISTING_NEWSLETTER_UUID,
            'email' => 'darth_maul@empire.com',
            'consentNewsletter' => true,
            'consentBlog' => false,
            'consentBeta' => true,
        ]);
    }
}
