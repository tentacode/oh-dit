<?php

declare(strict_types=1);

namespace App;

use Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\HttpKernel\Kernel as BaseKernel;

class Kernel extends BaseKernel
{
    use MicroKernelTrait;

    public function process(ContainerBuilder $containerBuilder): void
    {
        if ($this->environment === 'test') {
            // prevents the security token to be cleared
            $containerBuilder->getDefinition('security.token_storage')->clearTag('kernel.reset');
        }
    }
}
