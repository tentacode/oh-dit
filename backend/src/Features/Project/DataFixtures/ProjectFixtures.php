<?php

declare(strict_types=1);

namespace App\Features\Project\DataFixtures;

use App\Features\Authentication\DataFixtures\UserFixtures;
use App\Features\Authentication\Entity\Team;
use App\Features\Project\Entity\Project;
use App\Features\Project\Entity\Screen;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Nelmio\Alice\Loader\NativeLoader;

class ProjectFixtures extends Fixture
{
    public function getDependencies(): array
    {
        return [UserFixtures::class];
    }

    public function load(ObjectManager $manager): void
    {
        $nativeLoader = new NativeLoader();

        $objectSet = $nativeLoader->loadFile(
            __DIR__ . '/fixtures/projects.yaml',
            [],
            [
                'team-empire' => $this->getReference('team-empire', Team::class),
            ]
        );

        foreach ($objectSet->getObjects() as $id => $object) {
            if ($object instanceof Project) {
                $manager->persist($object);
                $this->addReference($id, $object);
            }

            if ($object instanceof Screen) {
                $manager->persist($object);
            }
        }

        $manager->flush();
    }
}
