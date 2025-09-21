<?php

declare(strict_types=1);

namespace App\Infrastructure\Postgres\Console;

use Doctrine\ORM\EntityManagerInterface;
use LogicException;
use PDO;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Throwable;
use Webmozart\Assert\Assert;

#[AsCommand(name: 'postgres:close-connections', description: 'Force closing all connections to the database.')]
class CloseConnectionsConsole extends Command
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $em)
    {
        $this->entityManager = $em;

        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $symfonyStyle = new SymfonyStyle($input, $output);

        // checking if the database exists
        try {
            $this->entityManager->getConnection()
                ->getDatabase();
        } catch (Throwable $throwable) {
            if (str_contains($throwable->getMessage(), 'does not exist')) {
                $symfonyStyle->comment('No need to close connection, database does not exist.');

                return Command::SUCCESS;
            }

            throw $throwable;
        }

        $sql = <<<SQL
            SELECT pg_terminate_backend(pid)
            FROM pg_stat_activity WHERE datname = current_database();
            SQL;

        try {
            $connection = $this->entityManager->getConnection();
            $pdo = $connection->getNativeConnection();
            Assert::isInstanceOf($pdo, PDO::class);

            $statement = $pdo->prepare($sql);
            $statement->execute();
        } catch (Throwable $throwable) {
            // Closing connections throws an exception, this is to be expected.
            if (
                str_contains($throwable->getMessage(), 'connection has been closed unexpectedly')
                || str_contains($throwable->getMessage(), 'server closed the connection unexpectedly')
            ) {
                $symfonyStyle->success('All connections have been closed.');

                return Command::SUCCESS;
            }

            throw $throwable;
        }

        throw new LogicException('An exception was expected.');
    }
}
