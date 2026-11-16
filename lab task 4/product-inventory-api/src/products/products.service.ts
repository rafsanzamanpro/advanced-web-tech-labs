import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto.js';
import { PartialUpdateProductDto } from './dto/partial-update-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { Products } from './entities/products.entity.js';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Products)
    private readonly productsRepo: Repository<Products>,
  ) {}

  async create(dto: CreateProductDto) {
    const product = this.productsRepo.create(dto);
    const savedProduct = await this.productsRepo.save(product);
    return { message: 'Product created successfully', data: savedProduct };
  }

  async findAll() {
    const products = await this.productsRepo.find({
      order: { createdAt: 'DESC' },
    });
    return {
      message: 'Products fetched successfully',
      count: products.length,
      data: products,
    };
  }

  async findOne(id: number) {
    const product = await this.getProductOrThrow(id);
    return { message: 'Product fetched successfully', data: product };
  }

  async update(id: number, dto: PartialUpdateProductDto) {
    const product = await this.getProductOrThrow(id);
    const updatedProduct = await this.productsRepo.save(
      this.productsRepo.merge(product, dto),
    );
    return { message: 'Product updated successfully', data: updatedProduct };
  }

  async replace(id: number, dto: UpdateProductDto) {
    const product = await this.getProductOrThrow(id);
    const replacement = this.productsRepo.create({
      id: product.id,
      name: dto.name,
      description: dto.description ?? null,
      price: dto.price,
      stock: dto.stock ?? 0,
      category: dto.category,
      isActive: dto.isActive ?? true,
    });
    const updatedProduct = await this.productsRepo.save(replacement);
    return { message: 'Product replaced successfully', data: updatedProduct };
  }

  async remove(id: number) {
    const product = await this.getProductOrThrow(id);
    await this.productsRepo.remove(product);
    return { message: 'Product deleted successfully', id };
  }

  async findByCategory(category: string) {
    const products = await this.productsRepo.find({
      where: { category },
      order: { createdAt: 'DESC' },
    });
    return {
      message: 'Products fetched by category successfully',
      count: products.length,
      data: products,
    };
  }

  async search(keyword: string) {
    const products = await this.productsRepo.find({
      where: { name: ILike(`%${keyword}%`) },
      order: { createdAt: 'DESC' },
    });
    return {
      message: 'Products searched successfully',
      count: products.length,
      data: products,
    };
  }

  async toggleActive(id: number) {
    const product = await this.getProductOrThrow(id);
    product.isActive = !product.isActive;
    const updatedProduct = await this.productsRepo.save(product);
    return {
      message: 'Product active status toggled successfully',
      data: updatedProduct,
    };
  }

  private async getProductOrThrow(id: number) {
    const product = await this.productsRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return product;
  }
}
