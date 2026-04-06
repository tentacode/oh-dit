<?php

declare(strict_types=1);

namespace App\Features\Authentication\Console;

use App\Features\Authentication\Command\SendRegistrationLinkCommand;
use App\Features\Authentication\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Webmozart\Assert\Assert;

#[AsCommand(name: 'ohdit:invite-beta', description: 'Invite a new user.')]
class InviteBetaConsole extends Command
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly SendRegistrationLinkCommand $sendRegistrationLinkCommand,
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
        Assert::string($email, 'Email argument is required and must be a string.');
        Assert::email($email, 'Email argument must be a valid email address.');

        $symfonyStyle->writeln(sprintf('Email: %s', $email));

        $existingUser = $this->entityManager->getRepository(User::class)->findOneByEmail($email);
        Assert::null($existingUser, 'User with this email already exists.');

        ($this->sendRegistrationLinkCommand)($email);

        $symfonyStyle->success('Invite sent successfully.');

        return Command::SUCCESS;
    }
}
