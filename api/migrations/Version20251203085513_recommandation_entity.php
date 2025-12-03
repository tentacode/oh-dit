<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20251203085513 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Adding Recommandation entity';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE TABLE recommandation (uuid UUID NOT NULL, user_uuid UUID DEFAULT NULL, rule_uuid UUID DEFAULT NULL, project_uuid UUID DEFAULT NULL, screen_uuid UUID DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, text TEXT NOT NULL, severity VARCHAR(20) NOT NULL, PRIMARY KEY(uuid))');
        $this->addSql('CREATE INDEX IDX_C7782A28ABFE1C6F ON recommandation (user_uuid)');
        $this->addSql('CREATE INDEX IDX_C7782A2882BB0FD1 ON recommandation (rule_uuid)');
        $this->addSql('CREATE INDEX IDX_C7782A28E8EE98BE ON recommandation (project_uuid)');
        $this->addSql('CREATE INDEX IDX_C7782A28D1C1A529 ON recommandation (screen_uuid)');
        $this->addSql('COMMENT ON COLUMN recommandation.uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN recommandation.user_uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN recommandation.rule_uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN recommandation.project_uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN recommandation.screen_uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN recommandation.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN recommandation.updated_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE recommandation ADD CONSTRAINT FK_C7782A28ABFE1C6F FOREIGN KEY (user_uuid) REFERENCES "user" (uuid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE recommandation ADD CONSTRAINT FK_C7782A2882BB0FD1 FOREIGN KEY (rule_uuid) REFERENCES rule (uuid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE recommandation ADD CONSTRAINT FK_C7782A28E8EE98BE FOREIGN KEY (project_uuid) REFERENCES project (uuid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE recommandation ADD CONSTRAINT FK_C7782A28D1C1A529 FOREIGN KEY (screen_uuid) REFERENCES project_screen (uuid) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE recommandation DROP CONSTRAINT FK_C7782A28ABFE1C6F');
        $this->addSql('ALTER TABLE recommandation DROP CONSTRAINT FK_C7782A2882BB0FD1');
        $this->addSql('ALTER TABLE recommandation DROP CONSTRAINT FK_C7782A28E8EE98BE');
        $this->addSql('ALTER TABLE recommandation DROP CONSTRAINT FK_C7782A28D1C1A529');
        $this->addSql('DROP TABLE recommandation');
    }
}
