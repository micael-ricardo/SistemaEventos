import request from "supertest";
import { App } from "../app";

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
            .field('price[sector]', event.price[0].sector)
            .field('price[amount]', event.price[0].amount)
            .attach('banner', '/Users/micae/Downloads/banner.jpg')
            .attach('flyers', '/Users/micae/Downloads/flyer1.png')
            .attach('flyers', '/Users/micae/Downloads/flyer1.png');

            if(response.error){
                console.log('Erro:', response.error);  
            }
        expect(response.status).toBe(201);
        expect(response.body).toEqual({ message: 'Evento Criado com sucesso.' });
    });
});