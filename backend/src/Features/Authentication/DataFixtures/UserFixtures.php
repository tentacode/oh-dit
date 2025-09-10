<?php

declare(strict_types=1);

namespace App\Features\Authentication\DataFixtures;

use App\Features\Authentication\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Nelmio\Alice\Loader\NativeLoader;

class UserFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $loader = new NativeLoader();
        $objectSet = $loader->loadFile(__DIR__ . '/fixtures/users.yaml');

        foreach ($objectSet->getObjects() as $id => $object) {
            if ($object instanceof User) {
                $manager->persist($object);
                $this->addReference($id, $object);
            }
        }

        $manager->flush();
    }
}
