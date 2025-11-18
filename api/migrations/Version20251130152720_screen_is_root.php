<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20251130152720 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Adding is_root field to project_screen table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE project_screen ADD is_root BOOLEAN NOT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE project_screen DROP is_root');
    }
}
