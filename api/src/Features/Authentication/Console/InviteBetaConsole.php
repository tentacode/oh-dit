<?php

declare(strict_types=1);

namespace App\Features\Authentication\Console;

use App\Features\Authentication\Entity\User;
use Brevo\Client\Api\TransactionalEmailsApi;
use Brevo\Client\Configuration;
use Brevo\Client\Model\SendSmtpEmail;
use Doctrine\ORM\EntityManagerInterface;
use GuzzleHttp\Client;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Webmozart\Assert\Assert;

#[AsCommand(name: 'ohdit:invite-beta', description: 'Invite a new user.')]
class InviteBetaConsole extends Command
{
    private const int INVITE_TEMPLATE_ID = 8;

    public function __construct(
        private readonly EntityManagerInterface $entityManager,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->setDescription('Invite a new user.')
            ->addArgument('email', null, 'Email of the user to invite.')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $symfonyStyle = new SymfonyStyle($input, $output);
        $symfonyStyle->info('Inviting new user...');

        $email = $input->getArgument('email');

        Assert::email($email);

        $symfonyStyle->writeln(sprintf('Email: %s', $email));

        $existingUser = $this->entityManager->getRepository(User::class)->findOneByEmail($email);
        Assert::null($existingUser, 'User with this email already exists.');

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

        $symfonyStyle->success('Invite sent successfully.');

        return Command::SUCCESS;
    }

    private function generateToken(string $email): string
    {
        Assert::string($_SERVER['APP_SECRET'], 'APP_SECRET is not set in server variables.');

        $payload = base64_encode($email);
        $signature = hash_hmac('sha256', $payload, $_SERVER['APP_SECRET']);

        return $payload . '.' . $signature;
    }
}
