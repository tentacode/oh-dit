<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260128110526 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Adding secured link fields to project entity';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE project ADD secured_link_token VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE project ADD secured_link_password_hash VARCHAR(180) DEFAULT NULL');
        $this->addSql('ALTER TABLE project ADD secured_link_updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL');
        $this->addSql('COMMENT ON COLUMN project.secured_link_updated_at IS \'(DC2Type:datetime_immutable)\'');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE project DROP secured_link_token');
        $this->addSql('ALTER TABLE project DROP secured_link_password_hash');
        $this->addSql('ALTER TABLE project DROP secured_link_updated_at');
    }
}
