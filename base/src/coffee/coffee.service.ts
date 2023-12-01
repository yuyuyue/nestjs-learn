import { Injectable, NotFoundException, Inject, Scope } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Flavor } from './entities/flavor.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Event } from '../events/entities/event.entity';
import { COFFEE_BRANDS } from './coffee.constant';
import { ConfigService, ConfigType } from '@nestjs/config';
import coffeeConfig from './config/coffee.config';

@Injectable({ scope: Scope.DEFAULT }) // DEFAULT 单例; TRANSIENT: 执行就创建实例 REQUEST: 每个请求都有实例
export class CoffeeService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepos: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepos: Repository<Flavor>,
    private readonly dataSource: DataSource, // @Inject(COFFEE_BRANDS) // coffeeBrands: string[], // private readonly configService: ConfigService, // @Inject(coffeeConfig.KEY) // private readonly coffeesConfigguration: ConfigType<typeof coffeeConfig>,
  ) {
    // const databaseHost = this.configService.get('coffees.foo');
    // const databaseHost = this.configService.get('coffees.foo');
    // console.log('Coffee Service Instance', this.coffeesConfigguration.foo);
  }

  findAll(paginationQuery: PaginationQueryDto) {
    const { limit, offset } = paginationQuery;
    return this.coffeeRepos.find({
      relations: ['flavors'], // 查找级联数据
      skip: offset, // 页码
      take: limit, // 每条数
    });
  }

  async findOne(id: number) {
    try {
      const coffee = await this.coffeeRepos.findOneBy({ id });
      if (!coffee) {
        throw new NotFoundException(`coffee ${id} not found`);
      }
      return coffee;
    } catch (e) {
      return e;
    }
  }

  async create(createCoffeeDto: CreateCoffeeDto) {
    const flavors = await Promise.all(
      createCoffeeDto?.flavors.map((f) => this.preloadFlavorsByName(f)),
    );
    const coffee = this.coffeeRepos.create({
      ...createCoffeeDto,
      flavors,
    });
    return this.coffeeRepos.save(coffee);
  }

  async update(id: number, updateCoffeeDto: UpdateCoffeeDto) {
    const flavors = await Promise.all(
      updateCoffeeDto?.flavors.map((f) => this.preloadFlavorsByName(f)),
    );
    const coffee = await this.coffeeRepos.preload({
      id,
      ...updateCoffeeDto,
      flavors,
    });
    if (!coffee) {
      throw new NotFoundException(`coffee ${id} not found`);
    }
    return this.coffeeRepos.save(coffee);
  }

  async remove(id: number) {
    const coffee = await this.coffeeRepos.findOneBy({ id });
    return this.coffeeRepos.remove(coffee);
  }

  async preloadFlavorsByName(name: string): Promise<Flavor> {
    const flavor = await this.flavorRepos.findOneBy({ name });
    if (flavor) {
      return flavor;
    }
    return this.flavorRepos.create({ name });
  }

  async recommendCoffee(coffee: Coffee) {
    const queryRunner = this.dataSource.createQueryRunner();
    queryRunner.connect();
    try {
      coffee.recommendations++;
      const recommendEvent = new Event();
      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffeeId: String(coffee.id) };

      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);

      await queryRunner.commitTransaction();
    } catch {
      queryRunner.rollbackTransaction();
    } finally {
      queryRunner.release();
    }
  }
}
