import { Repository } from 'typeorm';
import { GottenQueryDto, GottenResponseDto } from './common.dto';
import { OrderEnum } from './common.enum';
import { HttpException, HttpStatus } from '@nestjs/common';

export enum SearchWithEnum {
  STRING,
  NUMBER,
}

export class ApiFeature<T> {
  private repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  async generate(content: {
    queries: GottenQueryDto;
    searchWith: { column: string; type: SearchWithEnum }[];
  }): Promise<GottenResponseDto<T>> {
    const { queries, searchWith } = content;
    console.log(queries);
    const {
      page = 1,
      limit = 20,
      search,
      sort,
      order = OrderEnum.ASC,
      ...additionalConditions
    } = queries;
    const _page = +page;
    const _limit = +limit;
    
    const queryBuilder = this.repository.createQueryBuilder('entity');

    // Handle additional conditions
    if (additionalConditions) {
      Object.keys(additionalConditions).forEach((key) => {
        const value = additionalConditions[key];
        if (value) {
          queryBuilder.andWhere(`entity.${key} = :${key}`, { [key]: value });
        }
      });
    }

    // Search functionality
    if (search) {
      let searchString = '';

      searchWith.forEach((sw) => {
        switch (sw.type) {
          case SearchWithEnum.NUMBER:
            searchString += `CAST(entity.${sw.column} AS text)`;
            break;

          case SearchWithEnum.STRING:
            searchString += `entity.${sw.column}`;
        }

        searchString += ' LIKE :search OR ';
      });

      searchString = searchString.replace(/ OR $/, '');

      queryBuilder.andWhere(searchString, { search: `%${search}%` });
    }

    // Sorting functionality
    if (sort) {
      if (!order) {
        throw new HttpException('Kindly use sort with order: ASC or DESC !', HttpStatus.BAD_REQUEST);
      }

      queryBuilder.orderBy(`entity.${sort}`, order || OrderEnum.ASC);
    }

    // Pagination
    const [result, total] = await queryBuilder
      .skip((_page - 1) * _limit)
      .take(_limit)
      .getManyAndCount();

    return new GottenResponseDto<T>(
      result,
      total,
      _page,
      Math.ceil(total / _limit),
    );
  }
}
