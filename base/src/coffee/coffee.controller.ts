import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  Delete,
  Query,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { CoffeeService } from './coffee.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { REQUEST } from '@nestjs/core';
import { Public } from 'src/common/decorators/public.decorator';
import { ParseIntPipe } from 'src/common/pipes/parse-int/parse-int.pipe';
import { Protocol } from 'src/common/decorators/protocol.decorator.decorator';
import { ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('coffee')
@Controller('coffee')
export class CoffeeController {
  constructor(
    private coffeeService: CoffeeService,
    @Inject(REQUEST) private readonly request: Request, // 注入原生的Request
  ) {
    // console.log('Coffee Control Instance', request);
  }

  @ApiForbiddenResponse({ description: '禁止访问' })
  @Public()
  @Get()
  async findAll(
    @Protocol('http') protocol,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    // await new Promise((resolve) => setTimeout(resolve, 2000));
    return this.coffeeService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    const coffee = this.coffeeService.findOne(id);
    if (!coffee) {
      throw new HttpException(`coffe ${id} not found`, HttpStatus.NOT_FOUND);
    } else {
      return coffee;
    }
  }

  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    this.coffeeService.create(createCoffeeDto);
    return createCoffeeDto;
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeeService.update(id, updateCoffeeDto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.coffeeService.remove(id);
  }
}
