<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20251021140724 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'RuleSet entities';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE rule (uuid UUID NOT NULL, rule_category_uuid UUID DEFAULT NULL, short_description VARCHAR(180) NOT NULL, prefix VARCHAR(180) DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(uuid))');
        $this->addSql('CREATE INDEX IDX_46D8ACCCF068A456 ON rule (rule_category_uuid)');
        $this->addSql('COMMENT ON COLUMN rule.uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN rule.rule_category_uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN rule.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN rule.updated_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE rule_category (uuid UUID NOT NULL, rule_set_uuid UUID DEFAULT NULL, name VARCHAR(180) NOT NULL, prefix VARCHAR(180) DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(uuid))');
        $this->addSql('CREATE INDEX IDX_CAB0FA6D88445183 ON rule_category (rule_set_uuid)');
        $this->addSql('COMMENT ON COLUMN rule_category.uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN rule_category.rule_set_uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN rule_category.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN rule_category.updated_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('CREATE TABLE rule_set (uuid UUID NOT NULL, name VARCHAR(180) NOT NULL, description TEXT NOT NULL, version VARCHAR(180) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(uuid))');
        $this->addSql('COMMENT ON COLUMN rule_set.uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN rule_set.created_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('COMMENT ON COLUMN rule_set.updated_at IS \'(DC2Type:datetime_immutable)\'');
        $this->addSql('ALTER TABLE rule ADD CONSTRAINT FK_46D8ACCCF068A456 FOREIGN KEY (rule_category_uuid) REFERENCES rule_category (uuid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE rule_category ADD CONSTRAINT FK_CAB0FA6D88445183 FOREIGN KEY (rule_set_uuid) REFERENCES rule_set (uuid) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE rule DROP CONSTRAINT FK_46D8ACCCF068A456');
        $this->addSql('ALTER TABLE rule_category DROP CONSTRAINT FK_CAB0FA6D88445183');
        $this->addSql('DROP TABLE rule');
        $this->addSql('DROP TABLE rule_category');
        $this->addSql('DROP TABLE rule_set');
    }
}
