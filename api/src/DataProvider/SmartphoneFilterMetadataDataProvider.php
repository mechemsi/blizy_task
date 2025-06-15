<?php

namespace App\DataProvider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Model\SmartphoneFilterMetadata;
use App\Repository\BreezySmartphoneRepository;

class SmartphoneFilterMetadataDataProvider implements ProviderInterface
{

    public function __construct(
        private BreezySmartphoneRepository $repository
    ) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): SmartphoneFilterMetadata
    {
        return new SmartphoneFilterMetadata(
            $this->repository->getUniqueBrands(),
            $this->repository->getUniqueModels(),
            $this->repository->getUniqueGrades(),
            $this->repository->getUniqueStorage(),
            $this->repository->getUniqueColors(),
            $this->repository->getUniqueAvailability(),
            $this->repository->getUniqueCurrencies(),
        );
    }
}