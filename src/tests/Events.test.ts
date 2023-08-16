import request from "supertest";
import { App } from "../app";
import { EventRepository } from "../repositories/EventRepository";
import { EventUseCase } from "../useCases/EventUseCase";
import { Event } from "../entities/Event";

const app = new App()
const express = app.app;
describe('Event test', () => {
    it('/POST Event', async () => {
        const event = {
            title: 'Pagodinho Teste',
            price: [{ sector: 'Pista', amount: '20' }],
            categories: ['Show'],
            description: 'Evento Descrição',
            city: 'Belo Horizonte',
            location: {
                latitude: '-19.8658659',
                longitude: '-43.9737064',
            },
            coupons: [],
            date: new Date(),
            participants: [],
        };
        const response = await request(express)
            .post('/events')
            .field('title', event.title)
            .field('description', event.description)
            .field('categories', event.categories)
            .field('city', event.city)
            .field('coupons', event.coupons)
            .field('participants', event.participants)
            .field('location[latitude]', event.location.latitude)
            .field('location[longitude]', event.location.longitude)
            .field('date', event.date.toISOString())
            .field('price[sector]', event.price[0].sector)
            .field('price[amount]', event.price[0].amount)
            .attach('banner', '/Users/micae/Downloads/banner.jpg')
            .attach('flyers', '/Users/micae/Downloads/flyer1.png')
            .attach('flyers', '/Users/micae/Downloads/flyer1.png');

        if (response.error) {
            console.log('Erro:', response.error);
        }
        expect(response.status).toBe(201);
        expect(response.body).toEqual({ message: 'Evento Criado com sucesso.' });
    });
    it('/GET/:id Get event by id', async () => {
        const response = await request(express)
            .get('/events/64d534e30b78fc86d91945a2');
        if (response.error) {
            console.log('Erro:', response.error);
        }
        expect(response.status).toBe(200);
    });
    it('/GET/ event by location', async () => {
        const response = await request(express)
            .get('/events?latitude=-19.8658659&longitude=-43.9737064');
        if (response.error) {
            console.log('Erro:', response.error);
        }
        expect(response.status).toBe(200);
        expect(response.body).toBeGreaterThan(0);
        // 47:00
    });
});
const eventRepository = {
    add: jest.fn(),
    findEventsByCategory: jest.fn(),
    findByLocationAndDate: jest.fn(),
    findEventsByCity: jest.fn(),
    findEventsByName: jest.fn(),
    findEventById: jest.fn(),
};

const eventUseCase = new EventUseCase(eventRepository);

const event: Event = {
    title: 'Pagodinho Teste',
    price: [{ sector: 'Pista', amount: '20' }],
    categories: ['Show'],
    description: 'Evento Descrição',
    city: 'Belo Horizonte',
    location: {
        latitude: '-19.8658659',
        longitude: '-43.9737064',
    },
    banner: 'banner.png',
    flyers: ['flyer1.png', 'flyer2.png'],
    coupons: [],
    date: new Date(),
    participants: [],
};

describe('Unit Test', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })
    it('should return an array of by category', async () => {
        eventRepository.findEventsByCategory.mockResolvedValue([event]);
        const result = await eventUseCase.findEventsByCategory('Show')
        expect(result).toEqual([event])
        expect(eventRepository.findEventsByCategory).toHaveBeenCalledWith('Show');
    });
    it('should return an array of by name', async () => {
        eventRepository.findEventsByName.mockResolvedValue([event]);
        const result = await eventUseCase.findEventsByName('Pagodinho Teste')
        expect(result).toEqual([event])
        expect(eventRepository.findEventsByName).toHaveBeenCalledWith('Pagodinho Teste');
    });
    it('should return a event by Id', async () => {
        eventRepository.findEventById.mockResolvedValueOnce(event);
        const result = await eventUseCase.findEventById('64d534e30b78fc86d91945a2')
        expect(result).toEqual(event)
        expect(eventRepository.findEventById).toHaveBeenCalledWith('64d534e30b78fc86d91945a2');
    });
});