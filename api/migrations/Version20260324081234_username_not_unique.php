<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260324081234 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Removing unique constraint on username in user table to allow duplicate usernames';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE "user" DROP CONSTRAINT IF EXISTS UNIQ_8D93D649F85E0677');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649F85E0677 ON "user" (username)');
    }
}
