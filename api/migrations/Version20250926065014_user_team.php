<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250926065014 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE team (uuid UUID NOT NULL, name VARCHAR(180) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(uuid))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_C4E0A61F5E237E06 ON team (name)');
        $this->addSql('COMMENT ON COLUMN team.uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN team.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN team.updated_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE team_user (team_uuid UUID NOT NULL, user_uuid UUID NOT NULL, PRIMARY KEY(team_uuid, user_uuid))');
        $this->addSql('CREATE INDEX IDX_5C7222329EA4DD ON team_user (team_uuid)');
        $this->addSql('CREATE INDEX IDX_5C722232ABFE1C6F ON team_user (user_uuid)');
        $this->addSql('COMMENT ON COLUMN team_user.team_uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN team_user.user_uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('ALTER TABLE team_user ADD CONSTRAINT FK_5C7222329EA4DD FOREIGN KEY (team_uuid) REFERENCES team (uuid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE team_user ADD CONSTRAINT FK_5C722232ABFE1C6F FOREIGN KEY (user_uuid) REFERENCES "user" (uuid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE project ADD team_uuid UUID DEFAULT NULL');
        $this->addSql('COMMENT ON COLUMN project.team_uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('ALTER TABLE project ADD CONSTRAINT FK_2FB3D0EE9EA4DD FOREIGN KEY (team_uuid) REFERENCES team (uuid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_2FB3D0EE9EA4DD ON project (team_uuid)');
        $this->addSql('ALTER TABLE project_screen DROP CONSTRAINT fk_c8e88a7a166d1f9c');
        $this->addSql('DROP INDEX idx_c8e88a7a166d1f9c');
        $this->addSql('ALTER TABLE project_screen RENAME COLUMN project_id TO project_uuid');
        $this->addSql('ALTER TABLE project_screen ADD CONSTRAINT FK_C8E88A7AE8EE98BE FOREIGN KEY (project_uuid) REFERENCES project (uuid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_C8E88A7AE8EE98BE ON project_screen (project_uuid)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE project DROP CONSTRAINT FK_2FB3D0EE9EA4DD');
        $this->addSql('ALTER TABLE team_user DROP CONSTRAINT FK_5C7222329EA4DD');
        $this->addSql('ALTER TABLE team_user DROP CONSTRAINT FK_5C722232ABFE1C6F');
        $this->addSql('DROP TABLE team');
        $this->addSql('DROP TABLE team_user');
        $this->addSql('DROP INDEX IDX_2FB3D0EE9EA4DD');
        $this->addSql('ALTER TABLE project DROP team_uuid');
        $this->addSql('ALTER TABLE project_screen DROP CONSTRAINT FK_C8E88A7AE8EE98BE');
        $this->addSql('DROP INDEX IDX_C8E88A7AE8EE98BE');
        $this->addSql('ALTER TABLE project_screen RENAME COLUMN project_uuid TO project_id');
        $this->addSql('ALTER TABLE project_screen ADD CONSTRAINT fk_c8e88a7a166d1f9c FOREIGN KEY (project_id) REFERENCES project (uuid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX idx_c8e88a7a166d1f9c ON project_screen (project_id)');
    }
}
