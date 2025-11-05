<?php

declare(strict_types=1);

namespace App\Features\Newsletter\Console;

use App\Features\Newsletter\Command\AddToBrevoCommand;
use App\Features\Newsletter\Command\BrevoNewsletter;
use App\Features\Newsletter\Entity\Newsletter;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[AsCommand(name: 'ohdit:add-newsletters-to-brevo', description: 'Add an email to Brevo newsletter.')]
class AddToNewsletterConsole extends Command
{
    public function __construct(
        private readonly ValidatorInterface $validator,
        private readonly AddToBrevoCommand $addToBrevoCommand,
        private readonly EntityManagerInterface $entityManager,
    )
    {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->setDescription('Add all newsletter data to Brevo.')
        ;}

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->info('Adding to newsletter...');

        $newsletterEntities = $this->entityManager->getRepository(Newsletter::class)->findAll();
        $newsletters = [];
        foreach ($newsletterEntities as $newsletterEntity) {
            $brevoNewsletter = new BrevoNewsletter(
                email: $newsletterEntity->getEmail(),
                consentNewsletter: $newsletterEntity->getConsentNewsletter(),
                consentBlog: $newsletterEntity->getConsentBlog(),
                consentBeta: $newsletterEntity->getConsentBeta(),
            );

            $errors = $this->validator->validate($brevoNewsletter);
            if (count($errors) > 0) {
                foreach ($errors as $error) {
                    $io->error($error->getMessage());
                }
                return Command::FAILURE;
            }

            $newsletters[] = [
                'brevo' => $brevoNewsletter,
                'entity' => $newsletterEntity,
            ];
        }

        foreach ($newsletters as $newsletter) {
            ($this->addToBrevoCommand)($newsletter['brevo']);
            $this->entityManager->remove($newsletter['entity']);
        }

        $this->entityManager->flush();

        $io->success(sprintf('%d email(s) added to Brevo successfully.', count($newsletters)));

        return Command::SUCCESS;
    }
}
