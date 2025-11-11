<?php

declare(strict_types=1);

namespace App\Infrastructure\PHPUnit;

use function Safe\json_decode;
use Coduo\PHPMatcher\PHPUnit\PHPMatcherAssertions;
use JsonException;
use Symfony\Component\HttpFoundation\Response;
use Webmozart\Assert\Assert;

trait ResponseAssertions
{
    use PHPMatcherAssertions;

    protected function assertJsonResponseLength(
        int $expectedLength,
        Response $response,
    ): void {
        Assert::string($response->getContent());
        try {
            $responseData = json_decode($response->getContent(), true);
        } catch (JsonException $e) {
            $this->fail('Response content is not valid JSON: ' . $response->getContent());
        }

        Assert::isArray($responseData, 'Cannot assert length on non-array JSON response. Response content: ' . $response->getContent());

        $this->assertCount($expectedLength, $responseData, 'The JSON response does not have the expected length. Response content: ' . $response->getContent());
    }

    protected function assertJsonResponseMatches(
        mixed $expectedPattern,
        Response $response,
        int $expectedStatusCode = 200
    ): void {
        Assert::string($response->getContent());

        $shortResponseContent = strlen($response->getContent()) > 1000
            ? substr($response->getContent(), 0, 1000) . '...'
            : $response->getContent();

        try {
            json_decode($response->getContent(), true);
        } catch (JsonException $e) {
            $this->fail('Response content is not valid JSON: ' . $shortResponseContent);
        }

        $responseData = json_decode($response->getContent(), true);

        $this->assertSame('application/json', $response->headers->get('content-type'));
        $this->assertMatchesPattern($expectedPattern, $responseData, 'The JSON response does not match the expected pattern. Response content: ' . $shortResponseContent);
        $this->assertSame($expectedStatusCode, $response->getStatusCode(), 'The response status code is not as expected. Response content: ' . $shortResponseContent);
    }

    protected function assertJsonResponseEquals(
        mixed $expectedPattern,
        Response $response,
        int $expectedStatusCode = 200
    ): void {
        $this->assertSame($expectedStatusCode, $response->getStatusCode());
        $this->assertSame('application/json', $response->headers->get('content-type'));

        Assert::string($response->getContent());
        $responseData = json_decode($response->getContent(), true);

        $this->assertEquals($expectedPattern, $responseData);
    }
}
