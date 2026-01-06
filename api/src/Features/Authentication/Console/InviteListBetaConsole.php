<?php

declare(strict_types=1);

namespace App\Features\Authentication\Console;

use Brevo\Client\Api\ContactsApi;
use Brevo\Client\Configuration;
use Exception;
use GuzzleHttp\Client;
use Symfony\Component\Console\Application;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Throwable;
use Webmozart\Assert\Assert;

#[AsCommand(name: 'ohdit:invite-list-beta', description: 'Invite all the brevo list.')]
class InviteListBetaConsole extends Command
{
    public function __invoke(InputInterface $input, OutputInterface $output, Application $application): int
    {
        $symfonyStyle = new SymfonyStyle($input, $output);
        $symfonyStyle->info('Inviting users from the Brevo list...');

        $listId = $input->getArgument('list_id');
        Assert::notEmpty($listId, 'List ID must not be empty.');
        Assert::numeric($listId, 'List ID must be numeric.');

        Assert::notEmpty($_ENV['BREVO_API_KEY'], 'Brevo API key is not set in environment variables.');
        Assert::notEq($_ENV['BREVO_API_KEY'], 'CHANGE_ME', 'You still have CHANGE_ME in your .env file for the Brevo API key.');
        Assert::string($_ENV['BREVO_API_KEY'], 'Brevo API key must be a string.');

        $brevoConfig = Configuration::getDefaultConfiguration()
            ->setApiKey('api-key', $_ENV['BREVO_API_KEY']);

        try {
            $contactsApi = new ContactsApi(
                new Client(),
                $brevoConfig,
            );

            $contacts = $contactsApi->getContactsFromList(
                listId: (int) $listId,
                limit: 200,
                offset: 0
            );

            foreach ($contacts->getContacts() as $allOfgetContactsContactsItem) {
                $email = $allOfgetContactsContactsItem->getEmail();

                try {
                    $application->doRun(new ArrayInput([
                        'command' => 'ohdit:invite-beta',
                        'email' => $email,
                    ]), $output);
                } catch (Throwable $e) {
                    continue;
                }
            }
        } catch (Exception $e) {
            $symfonyStyle->error('Error occurred: ' . $e->getMessage());

            return Command::FAILURE;
        }

        $symfonyStyle->success('All invites sent successfully.');

        return Command::SUCCESS;
    }

    protected function configure(): void
    {
        $this
            ->setDescription('Invite all users from the Brevo list.')
            ->addArgument('list_id', InputArgument::REQUIRED, 'ID of the Brevo list to invite.')
        ;
    }
}
