<?php

declare(strict_types=1);

namespace App\Features\Authentication\DataFixtures;

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

        foreach ($objectSet->getObjects() as $id => $user) {
            if ($user instanceof User) {
                $user->setHashedPassword(
                    $this->userPasswordHasher->hashPassword($user, $user->getPassword())
                );

                $manager->persist($user);
                $this->addReference($id, $user);
            }
        }

        $manager->flush();
    }
}
