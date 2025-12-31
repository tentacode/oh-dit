<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20260103103514 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Adding issue status and status history fields';
    }

    public function up(Schema $schema): void
    {
        // Ajout des colonnes en NULLABLE d'abord
        $this->addSql('ALTER TABLE issue ADD status_updated_by_user_uuid UUID DEFAULT NULL');
        $this->addSql('ALTER TABLE issue ADD status VARCHAR(20) DEFAULT NULL');
        $this->addSql('ALTER TABLE issue ADD status_updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL');
        $this->addSql('ALTER TABLE issue ADD status_change_history JSONB DEFAULT NULL');
        $this->addSql('COMMENT ON COLUMN issue.status_updated_by_user_uuid IS \'(DC2Type:uuid)\'');
        $this->addSql('COMMENT ON COLUMN issue.status_updated_at IS \'(DC2Type:datetime_immutable)\'');

        // Remplissage des données existantes
        $this->addSql("
            UPDATE issue SET
                status = 'pending',
                status_updated_at = created_at,
                status_updated_by_user_uuid = user_uuid,
                status_change_history = jsonb_build_array(
                    jsonb_build_object(
                        'status', 'pending',
                        'statusUpdatedBy', user_uuid::text,
                        'statusUpdatedAt', created_at AT TIME ZONE 'UTC'
                    )
                )
        ");

        // Passage en NOT NULL
        $this->addSql('ALTER TABLE issue ALTER COLUMN status SET NOT NULL');
        $this->addSql('ALTER TABLE issue ALTER COLUMN status_updated_at SET NOT NULL');
        $this->addSql('ALTER TABLE issue ALTER COLUMN status_change_history SET NOT NULL');

        // Ajout de la FK et de l'index
        $this->addSql('ALTER TABLE issue ADD CONSTRAINT FK_12AD233EFFE7C9D2 FOREIGN KEY (status_updated_by_user_uuid) REFERENCES "user" (uuid) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_12AD233EFFE7C9D2 ON issue (status_updated_by_user_uuid)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE issue DROP CONSTRAINT FK_12AD233EFFE7C9D2');
        $this->addSql('DROP INDEX IDX_12AD233EFFE7C9D2');
        $this->addSql('ALTER TABLE issue DROP status_updated_by_user_uuid');
        $this->addSql('ALTER TABLE issue DROP status');
        $this->addSql('ALTER TABLE issue DROP status_updated_at');
        $this->addSql('ALTER TABLE issue DROP status_change_history');
    }
}
