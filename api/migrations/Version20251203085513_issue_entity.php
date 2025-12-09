<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20251203085513 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Adding Issue entity';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE issue (uuid UUID NOT NULL, user_uuid UUID DEFAULT NULL, rule_uuid UUID DEFAULT NULL, project_uuid UUID DEFAULT NULL, screen_uuid UUID DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, text TEXT NOT NULL, severity VARCHAR(20) NOT NULL, PRIMARY KEY(uuid))');
        $this->addSql('CREATE INDEX IDX_C7782A28ABFE1C6F ON issue (user_uuid)');
        $this->addSql('CREATE INDEX IDX_C7782A2882BB0FD1 ON issue (rule_uuid)');
        $this->addSql('CREATE INDEX IDX_C7782A28E8EE98BE ON issue (project_uuid)');
        $this->addSql('CREATE INDEX IDX_C7782A28D1C1A529 ON issue (screen_uuid)');
        $this->addSql('COMMENT ON COLUMN issue.uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN issue.user_uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN issue.rule_uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN issue.project_uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN issue.screen_uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN issue.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN issue.updated_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE issue ADD CONSTRAINT FK_C7782A28ABFE1C6F FOREIGN KEY (user_uuid) REFERENCES "user" (uuid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE issue ADD CONSTRAINT FK_C7782A2882BB0FD1 FOREIGN KEY (rule_uuid) REFERENCES rule (uuid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE issue ADD CONSTRAINT FK_C7782A28E8EE98BE FOREIGN KEY (project_uuid) REFERENCES project (uuid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE issue ADD CONSTRAINT FK_C7782A28D1C1A529 FOREIGN KEY (screen_uuid) REFERENCES project_screen (uuid) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE issue DROP CONSTRAINT FK_C7782A28ABFE1C6F');
        $this->addSql('ALTER TABLE issue DROP CONSTRAINT FK_C7782A2882BB0FD1');
        $this->addSql('ALTER TABLE issue DROP CONSTRAINT FK_C7782A28E8EE98BE');
        $this->addSql('ALTER TABLE issue DROP CONSTRAINT FK_C7782A28D1C1A529');
        $this->addSql('DROP TABLE issue');
    }
}
