<?php

namespace App\Repository;

use App\Entity\BreezySmartphone;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class BreezySmartphoneRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, BreezySmartphone::class);
    }

    public function getUniqueBrands(): array
    {
        return $this->createQueryBuilder('s')
            ->select('DISTINCT s.brand')
            ->where('s.brand IS NOT NULL')
            ->orderBy('s.brand', 'ASC')
            ->getQuery()
            ->getSingleColumnResult();
    }

    public function getUniqueModels(): array
    {
        return $this->createQueryBuilder('s')
            ->select('DISTINCT s.model')
            ->where('s.model IS NOT NULL')
            ->orderBy('s.model', 'ASC')
            ->getQuery()
            ->getSingleColumnResult();
    }

    public function getUniqueGrades(): array
    {
        return $this->createQueryBuilder('s')
            ->select('DISTINCT s.grade')
            ->where('s.grade IS NOT NULL')
            ->orderBy('s.grade', 'ASC')
            ->getQuery()
            ->getSingleColumnResult();
    }

    public function getUniqueStorage(): array
    {
        return $this->createQueryBuilder('s')
            ->select('DISTINCT s.storage')
            ->where('s.storage IS NOT NULL')
            ->orderBy('s.storage', 'ASC')
            ->getQuery()
            ->getSingleColumnResult();
    }

    public function getUniqueColors(): array
    {
        return $this->createQueryBuilder('s')
            ->select('DISTINCT s.color')
            ->where('s.color IS NOT NULL')
            ->orderBy('s.color', 'ASC')
            ->getQuery()
            ->getSingleColumnResult();
    }

    public function getUniqueAvailability(): array
    {
        return $this->createQueryBuilder('s')
            ->select('DISTINCT s.availability')
            ->where('s.availability IS NOT NULL')
            ->orderBy('s.availability', 'ASC')
            ->getQuery()
            ->getSingleColumnResult();
    }

    public function getUniqueCurrencies(): array
    {
        return $this->createQueryBuilder('s')
            ->select('DISTINCT s.currency')
            ->where('s.currency IS NOT NULL')
            ->orderBy('s.currency', 'ASC')
            ->getQuery()
            ->getSingleColumnResult();
    }
}