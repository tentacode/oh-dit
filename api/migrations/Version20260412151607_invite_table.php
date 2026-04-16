<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260412151607 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Creating invite table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE invite (uuid UUID NOT NULL, team_uuid UUID DEFAULT NULL, created_by_uuid UUID DEFAULT NULL, crypted_email VARCHAR(180) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(uuid))');
        $this->addSql('CREATE INDEX IDX_C7E210D79EA4DD ON invite (team_uuid)');
        $this->addSql('CREATE INDEX IDX_C7E210D7A17A1B5D ON invite (created_by_uuid)');
        $this->addSql('COMMENT ON COLUMN invite.uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN invite.team_uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN invite.created_by_uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN invite.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE invite ADD CONSTRAINT FK_C7E210D79EA4DD FOREIGN KEY (team_uuid) REFERENCES team (uuid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE invite ADD CONSTRAINT FK_C7E210D7A17A1B5D FOREIGN KEY (created_by_uuid) REFERENCES "user" (uuid) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE invite DROP CONSTRAINT FK_C7E210D79EA4DD');
        $this->addSql('ALTER TABLE invite DROP CONSTRAINT FK_C7E210D7A17A1B5D');
        $this->addSql('DROP TABLE invite');
    }
}
