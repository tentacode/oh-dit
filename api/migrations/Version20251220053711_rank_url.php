<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20251220053711 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add url field to project and project_screen, add rank field to project_screen';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE project ADD url TEXT NOT NULL DEFAULT \'\'');
        $this->addSql('ALTER TABLE project_screen ADD url TEXT NOT NULL DEFAULT \'\'');
        $this->addSql('ALTER TABLE project_screen ADD rank INT NOT NULL DEFAULT 0');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE project DROP url');
        $this->addSql('ALTER TABLE project_screen DROP url');
        $this->addSql('ALTER TABLE project_screen DROP rank');
    }
}
