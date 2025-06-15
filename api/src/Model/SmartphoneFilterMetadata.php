<?php

namespace App\Model;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\DataProvider\SmartphoneFilterMetadataDataProvider;

#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/smartphones/filter-metadata',
            provider: SmartphoneFilterMetadataDataProvider::class,
        )
    ],
    formats: ['json'],
)]
class SmartphoneFilterMetadata
{
    public readonly ?int $id;

    public function __construct(
        public readonly array $brands = [],
        public readonly array $models = [],
        public readonly array $grades = [],
        public readonly array $storage = [],
        public readonly array $colors = [],
        public readonly array $availability = [],
        public readonly array $currencies = [],
    ) {
        $this->id = 1;
    }
}