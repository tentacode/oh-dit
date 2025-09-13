<?php

declare(strict_types=1);

namespace App\Features\Project\DataFixtures;

use App\Features\Project\Entity\Project;
use App\Features\Project\Entity\Screen;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Nelmio\Alice\Loader\NativeLoader;

class ProjectFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $loader = new NativeLoader();
        $objectSet = $loader->loadFile(__DIR__ . '/fixtures/projects.yaml');

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
