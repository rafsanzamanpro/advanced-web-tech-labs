var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { Products } from './entities/products.entity.js';
let ProductsService = class ProductsService {
    productsRepo;
    constructor(productsRepo) {
        this.productsRepo = productsRepo;
    }
    async create(dto) {
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
    async findOne(id) {
        const product = await this.getProductOrThrow(id);
        return { message: 'Product fetched successfully', data: product };
    }
    async update(id, dto) {
        const product = await this.getProductOrThrow(id);
        const updatedProduct = await this.productsRepo.save(this.productsRepo.merge(product, dto));
        return { message: 'Product updated successfully', data: updatedProduct };
    }
    async replace(id, dto) {
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
    async remove(id) {
        const product = await this.getProductOrThrow(id);
        await this.productsRepo.remove(product);
        return { message: 'Product deleted successfully', id };
    }
    async findByCategory(category) {
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
    async search(keyword) {
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
    async toggleActive(id) {
        const product = await this.getProductOrThrow(id);
        product.isActive = !product.isActive;
        const updatedProduct = await this.productsRepo.save(product);
        return {
            message: 'Product active status toggled successfully',
            data: updatedProduct,
        };
    }
    async getProductOrThrow(id) {
        const product = await this.productsRepo.findOne({ where: { id } });
        if (!product) {
            throw new NotFoundException(`Product with id ${id} not found`);
        }
        return product;
    }
};
ProductsService = __decorate([
    Injectable(),
    __param(0, InjectRepository(Products)),
    __metadata("design:paramtypes", [Repository])
], ProductsService);
export { ProductsService };
//# sourceMappingURL=products.service.js.map