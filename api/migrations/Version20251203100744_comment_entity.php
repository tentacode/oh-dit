<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20251203100744 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Adding Comment entity';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE comment (uuid UUID NOT NULL, user_uuid UUID DEFAULT NULL, rule_uuid UUID DEFAULT NULL, project_uuid UUID DEFAULT NULL, screen_uuid UUID DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, text TEXT NOT NULL, PRIMARY KEY(uuid))');
        $this->addSql('CREATE INDEX IDX_9474526CABFE1C6F ON comment (user_uuid)');
        $this->addSql('CREATE INDEX IDX_9474526C82BB0FD1 ON comment (rule_uuid)');
        $this->addSql('CREATE INDEX IDX_9474526CE8EE98BE ON comment (project_uuid)');
        $this->addSql('CREATE INDEX IDX_9474526CD1C1A529 ON comment (screen_uuid)');
        $this->addSql('COMMENT ON COLUMN comment.uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN comment.user_uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN comment.rule_uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN comment.project_uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN comment.screen_uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN comment.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN comment.updated_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526CABFE1C6F FOREIGN KEY (user_uuid) REFERENCES "user" (uuid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526C82BB0FD1 FOREIGN KEY (rule_uuid) REFERENCES rule (uuid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526CE8EE98BE FOREIGN KEY (project_uuid) REFERENCES project (uuid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE comment ADD CONSTRAINT FK_9474526CD1C1A529 FOREIGN KEY (screen_uuid) REFERENCES project_screen (uuid) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE comment DROP CONSTRAINT FK_9474526CABFE1C6F');
        $this->addSql('ALTER TABLE comment DROP CONSTRAINT FK_9474526C82BB0FD1');
        $this->addSql('ALTER TABLE comment DROP CONSTRAINT FK_9474526CE8EE98BE');
        $this->addSql('ALTER TABLE comment DROP CONSTRAINT FK_9474526CD1C1A529');
        $this->addSql('DROP TABLE comment');
    }
}
