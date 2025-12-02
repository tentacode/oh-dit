<?php

declare(strict_types=1);

namespace App\Features\Authentication\Console;

use App\Features\Authentication\Entity\Team;
use App\Features\Authentication\Entity\User;
use App\Infrastructure\Symfony\ErrorHandling\Command\ValidateOrThrowApiErrorCommand;
use Brevo\Client\Api\TransactionalEmailsApi;
use Brevo\Client\Configuration;
use Brevo\Client\Model\SendSmtpEmail;
use Doctrine\ORM\EntityManagerInterface;
use GuzzleHttp\Client;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Webmozart\Assert\Assert;

#[AsCommand(name: 'ohdit:invite-new-user', description: 'Invite a new user.')]
class InviteNewUserConsole extends Command
{
    private const int INVITE_TEMPLATE_ID = 8;

    public function __construct(
        private readonly ValidateOrThrowApiErrorCommand $validateOrThrow,
        private readonly EntityManagerInterface $entityManager,
        private readonly UserPasswordHasherInterface $userPasswordHasher,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->setDescription('Invite a new user.')
            ->addArgument('email', null, 'Email of the user to invite.')
            ->addArgument('username', null, 'Username of the user to invite.')
            ->addArgument('team', null, 'Team of the user to invite.')
            ->addOption('password', null, InputOption::VALUE_REQUIRED, 'Password for the new user.')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $symfonyStyle = new SymfonyStyle($input, $output);
        $symfonyStyle->info('Inviting new user...');

        $email = $input->getArgument('email');
        $username = $input->getArgument('username');
        $teamName = $input->getArgument('team');
        $plainPassword = $input->getOption('password') ? $input->getOption('password') : $this->generateRandomPassword();

        Assert::email($email);
        Assert::notEmpty($username);
        Assert::notEmpty($teamName);
        Assert::notEmpty($plainPassword);
        Assert::string($username);
        Assert::string($teamName);
        Assert::string($plainPassword);

        $symfonyStyle->writeln(sprintf('Email: %s', $email));
        $symfonyStyle->writeln(sprintf('Username: %s', $username));
        $symfonyStyle->writeln(sprintf('Team: %s', $teamName));
        $symfonyStyle->writeln(sprintf('Password: %s', $plainPassword));

        $existingUser = $this->entityManager->getRepository(User::class)->findOneByEmail($email);
        Assert::null($existingUser, 'User with this email already exists.');

        $user = new User(
            email: $email,
            plainPassword: $plainPassword,
            username: $username,
        );

        $user->setHashedPassword($this->userPasswordHasher->hashPassword($user, $plainPassword));

        $team = $this->entityManager->getRepository(Team::class)->findOneByName($teamName);
        if ($team === null) {
            $team = new Team($teamName);
        }

        $team->addUser($user);

        ($this->validateOrThrow)($user);
        ($this->validateOrThrow)($team);

        $this->entityManager->persist($user);
        $this->entityManager->persist($team);
        $this->entityManager->flush();

        $symfonyStyle->success('User created successfully.');

        Assert::notEmpty($_ENV['BREVO_API_KEY'], 'Brevo API key is not set in environment variables.');
        Assert::notEq($_ENV['BREVO_API_KEY'], 'CHANGE_ME', 'You still have CHANGE_ME in your .env file for the Brevo API key.');
        Assert::string($_ENV['BREVO_API_KEY'], 'Brevo API key must be a string.');

        $brevoConfig = Configuration::getDefaultConfiguration()
            ->setApiKey('api-key', $_ENV['BREVO_API_KEY']);

        $sendSmtpEmail = new SendSmtpEmail([
            'to' => [
                [
                    'email' => $email,
                    'name' => $username,
                ],
            ],
            'templateId' => self::INVITE_TEMPLATE_ID,
            'params' => [
                'invite_email' => $user->getEmail(),
                'invite_password' => $plainPassword,
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

    private function generateRandomPassword(): string
    {
        $length = 20;
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $specialCharacters = '!@#$%^*()-_=+[]{}|;:,.?';

        // Ensure the password contains at least two special character
        $randomPassword = $specialCharacters[random_int(0, strlen($specialCharacters) - 1)];
        $randomPassword .= $specialCharacters[random_int(0, strlen($specialCharacters) - 1)];
        for ($i = 2; $i < $length; ++$i) {
            $randomPassword .= $characters[random_int(0, strlen($characters) - 1)];
        }

        // Shuffle the password to mix the special character
        $randomPassword = str_shuffle($randomPassword);

        return $randomPassword;
    }
}
