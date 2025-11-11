<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20251111153137 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Adding ruleset relation to project';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE project ADD rule_set_uuid UUID DEFAULT NULL');
        $this->addSql('COMMENT ON COLUMN project.rule_set_uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('ALTER TABLE project ADD CONSTRAINT FK_2FB3D0EE88445183 FOREIGN KEY (rule_set_uuid) REFERENCES rule_set (uuid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_2FB3D0EE88445183 ON project (rule_set_uuid)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE project DROP CONSTRAINT FK_2FB3D0EE88445183');
        $this->addSql('DROP INDEX IDX_2FB3D0EE88445183');
        $this->addSql('ALTER TABLE project DROP rule_set_uuid');
    }
}
