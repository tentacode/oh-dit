<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20251111104217 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Compliance entity creation';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE compliance (uuid UUID NOT NULL, user_uuid UUID DEFAULT NULL, rule_uuid UUID DEFAULT NULL, project_uuid UUID DEFAULT NULL, screen_uuid UUID DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, status VARCHAR(20) NOT NULL, PRIMARY KEY(uuid))');
        $this->addSql('CREATE INDEX IDX_A4C9FDD3ABFE1C6F ON compliance (user_uuid)');
        $this->addSql('CREATE INDEX IDX_A4C9FDD382BB0FD1 ON compliance (rule_uuid)');
        $this->addSql('CREATE INDEX IDX_A4C9FDD3E8EE98BE ON compliance (project_uuid)');
        $this->addSql('CREATE INDEX IDX_A4C9FDD3D1C1A529 ON compliance (screen_uuid)');
        $this->addSql('COMMENT ON COLUMN compliance.uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN compliance.user_uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN compliance.rule_uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN compliance.project_uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN compliance.screen_uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN compliance.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE compliance ADD CONSTRAINT FK_A4C9FDD3ABFE1C6F FOREIGN KEY (user_uuid) REFERENCES "user" (uuid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE compliance ADD CONSTRAINT FK_A4C9FDD382BB0FD1 FOREIGN KEY (rule_uuid) REFERENCES rule (uuid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE compliance ADD CONSTRAINT FK_A4C9FDD3E8EE98BE FOREIGN KEY (project_uuid) REFERENCES project (uuid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE compliance ADD CONSTRAINT FK_A4C9FDD3D1C1A529 FOREIGN KEY (screen_uuid) REFERENCES project_screen (uuid) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE compliance DROP CONSTRAINT FK_A4C9FDD3ABFE1C6F');
        $this->addSql('ALTER TABLE compliance DROP CONSTRAINT FK_A4C9FDD382BB0FD1');
        $this->addSql('ALTER TABLE compliance DROP CONSTRAINT FK_A4C9FDD3E8EE98BE');
        $this->addSql('ALTER TABLE compliance DROP CONSTRAINT FK_A4C9FDD3D1C1A529');
        $this->addSql('DROP TABLE compliance');
    }
}
