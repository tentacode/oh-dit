<?php

declare(strict_types=1);

namespace App\Features\Authentication\DataFixtures;

use App\Features\Authentication\Entity\Team;
use App\Features\Authentication\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Nelmio\Alice\Loader\NativeLoader;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserFixtures extends Fixture
{
    public function __construct(
        private UserPasswordHasherInterface $userPasswordHasher
    ) {
    }

    public function load(ObjectManager $manager): void
    {
        $nativeLoader = new NativeLoader();
        $objectSet = $nativeLoader->loadFile(__DIR__ . '/fixtures/users.yaml');

        foreach ($objectSet->getObjects() as $id => $object) {
            if ($object instanceof User) {
                $object->setHashedPassword(
                    $this->userPasswordHasher->hashPassword($object, $object->getPassword())
                );

                $manager->persist($object);
                $this->addReference($id, $object);
            }

            if ($object instanceof Team) {
                $manager->persist($object);
                $this->addReference($id, $object);
            }
        }

        $manager->flush();
    }
}
