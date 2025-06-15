<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\RangeFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\BreezySmartphoneRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: BreezySmartphoneRepository::class)]
#[ORM\Table(name: 'breezy_smartphones')]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Post(),
        new Get(),
        new Put(),
        new Patch(),
        new Delete(),
    ],
    formats: ['json', 'jsonld'],
    paginationEnabled: true,
    paginationItemsPerPage: 20,
    paginationMaximumItemsPerPage: 100,
)]
#[ApiFilter(SearchFilter::class, properties: [
    'brand' => 'ipartial',
    'model' => 'ipartial', 
    'category' => 'ipartial',
    'grade' => 'exact',
    'storage' => 'exact',
    'color' => 'ipartial',
    'availability' => 'exact',
    'currency' => 'exact',
])]
#[ApiFilter(RangeFilter::class, properties: ['price'])]
#[ApiFilter(DateFilter::class, properties: ['scrapedAt', 'updatedAt'])]
#[ApiFilter(OrderFilter::class, properties: [
    'price',
], arguments: ['orderParameterName' => 'order'])]
class BreezySmartphone
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(type: 'integer')]
    private ?int $id = null;

    #[ORM\Column(type: 'datetime')]
    public readonly ?\DateTimeInterface $scrapedAt;

    #[ORM\Column(type: 'datetime')]
    public readonly ?\DateTimeInterface $updatedAt;

    public function __construct(
    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    public ?string $category = null,
    #[ORM\Column(type: 'string', length: 100, nullable: true)]
    public ?string $brand = null,
    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    public ?string $model = null,
    #[ORM\Column(type: 'string', length: 50, nullable: true)]
    public ?string $grade = null,
    #[ORM\Column(type: 'string', length: 50, nullable: true)]
    public ?string $storage = null,
    #[ORM\Column(type: 'string', length: 100, nullable: true)]
    public ?string $color = null,
    #[ORM\Column(type: 'text', nullable: true)]
    public ?string $conditionDescription = null,
    #[ORM\Column(type: 'decimal', precision: 10, scale: 2, nullable: true)]
    public ?float $price = null,
    #[ORM\Column(type: 'string', length: 10, nullable: true)]
    public ?string $currency = null,
    #[ORM\Column(type: 'string', length: 500, nullable: true)]
    public ?string $url = null,
    #[ORM\Column(type: 'string', length: 500, nullable: true)]
    public ?string $imageUrl = null,
    #[ORM\Column(type: 'string', length: 50, nullable: true)]
    public ?string $availability = null,
    #[ORM\Column(type: 'string', length: 100, nullable: true)]
    public ?string $productCode = null,
    ) {
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'category' => $this->category,
            'brand' => $this->brand,
            'model' => $this->model,
            'grade' => $this->grade,
            'storage' => $this->storage,
            'color' => $this->color,
            'conditionDescription' => $this->conditionDescription,
            'price' => $this->price,
            'currency' => $this->currency,
            'url' => $this->url,
            'imageUrl' => $this->imageUrl,
            'availability' => $this->availability,
            'productCode' => $this->productCode,
            'scrapedAt' => $this->scrapedAt?->format('Y-m-d H:i:s'),
            'updatedAt' => $this->updatedAt?->format('Y-m-d H:i:s'),
        ];
    }
}
