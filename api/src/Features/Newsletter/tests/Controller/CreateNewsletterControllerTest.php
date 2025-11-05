<?php

declare(strict_types=1);

namespace App\Features\Newsletter\tests\Controller;

use App\Infrastructure\PHPUnit\ApiRequest;
use App\Infrastructure\PHPUnit\LoginRequest;
use App\Infrastructure\PHPUnit\ResponseAssertions;
use Iterator;
use PHPUnit\Framework\Attributes\DataProvider;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

final class CreateNewsletterControllerTest extends WebTestCase
{
    use ApiRequest;
    use LoginRequest;
    use ResponseAssertions;

    // We don't have brevo in the test env
    // public function test_it_can_add_a_newsletter(): void
    // {
    //     $response = $this->request(
    //         uri: '/api/newsletters',
    //         method: Request::METHOD_POST,
    //         payload: [
    //             'email' => 'toto@example.com',
    //             'consentNewsletter' => true,
    //             'consentBlog' => false,
    //             'consentBeta' => true,
    //         ],
    //     );

    //     $this->assertJsonResponseMatches([
    //         'uuid' => '@uuid@',
    //         'email' => 'toto@example.com',
    //         'consentNewsletter' => true,
    //         'consentBlog' => false,
    //         'consentBeta' => true,
    //         'createdAt' => '@datetime@.after("today")',
    //         'updatedAt' => '@datetime@.after("today")',
    //     ], $response, Response::HTTP_CREATED);
    // }

    /**
     * @param array<mixed> $payload
     * @param array<mixed> $expectedResponse
     */
    #[DataProvider('invalidNewsletterPayloadProvider')]
    public function test_it_cant_add_a_newsletter_with_invalid_payload(
        array $payload,
        array $expectedResponse
    ): void {
        $response = $this->request(
            uri: '/api/newsletters',
            method: Request::METHOD_POST,
            payload: $payload,
            authenticationToken: $this->getAuthenticationToken(
                email: 'darth_vader@empire.com',
                password: 'vader_64',
            ),
        );

        $this->assertJsonResponseEquals($expectedResponse, $response, Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    public static function invalidNewsletterPayloadProvider(): Iterator
    {
        yield 'empty payload' => [
            [
            ],
            [
                'code' => 'unprocessable_entity',
                'message' => 'Validation Failed',
                'errors' => [
                    [
                        'code' => null,
                        'propertyPath' => 'email',
                        'message' => 'Cette valeur doit être de type string.',
                    ],
                    [
                        'code' => null,
                        'propertyPath' => 'consentBeta',
                        'message' => 'Cette valeur doit être de type bool.',
                    ],
                    [
                        'code' => null,
                        'propertyPath' => 'consentNewsletter',
                        'message' => 'Cette valeur doit être de type bool.',
                    ],
                    [
                        'code' => null,
                        'propertyPath' => 'consentBlog',
                        'message' => 'Cette valeur doit être de type bool.',
                    ],
                ],
            ],
        ];

        yield 'invalid email' => [
            [
                'email' => 'not-an-email',
                'consentNewsletter' => true,
                'consentBlog' => false,
                'consentBeta' => true,
            ],
            [
                'code' => 'unprocessable_entity',
                'message' => 'Validation Failed',
                'errors' => [
                    [
                        'code' => 'bd79c0ab-ddba-46cc-a703-a7a4b08de310',
                        'propertyPath' => 'email',
                        'message' => 'L\'adresse email "not-an-email" n\'est pas valide.',
                    ],
                ],
            ],
        ];

        yield 'no consent given' => [
            [
                'email' => 'salut@examle.com',
                'consentNewsletter' => false,
                'consentBlog' => false,
                'consentBeta' => false,
            ],
            [
                'code' => 'unprocessable_entity',
                'message' => 'Validation Failed',
                'errors' => [
                    [
                        'code' => '6b3befbc-2f01-4ddf-be21-b57898905284',
                        'propertyPath' => 'consentBeta',
                        'message' => "Choisissez au moins une des options de la newsletter pour que l'on puisse vous contacter.",
                    ],
                ],
            ],
        ];
    }
}
