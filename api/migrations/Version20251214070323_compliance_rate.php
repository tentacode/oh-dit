<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20251214070323 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Adding complianceRate to Project and Screen, and progress to Screen';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE project ADD compliance_rate INT NOT NULL DEFAULT 0');
        $this->addSql('ALTER TABLE project ADD compliance_rate_updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL');
        $this->addSql('COMMENT ON COLUMN project.compliance_rate_updated_at IS \'(DC2Type:datetime_immutable)\'');

        $this->addSql('ALTER TABLE project_screen ADD progress INT NOT NULL DEFAULT 0');
        $this->addSql('ALTER TABLE project_screen ADD compliance_rate INT NOT NULL DEFAULT 0');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE project DROP compliance_rate');
        $this->addSql('ALTER TABLE project_screen DROP progress');
        $this->addSql('ALTER TABLE project DROP compliance_rate_updated_at');
        $this->addSql('ALTER TABLE project_screen DROP compliance_rate');
    }
}
