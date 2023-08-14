import axios from "axios";
import { Event } from "../entities/Event";
import { HttpException } from "../interfaces/HttpException";
import { EventRepository } from "../repositories/EventRepository";

class EventUseCase {
    constructor(private eventRepository: EventRepository) { }
    async create(eventData: Event) {

        if (!eventData.banner) throw new HttpException(400, 'Banner is required');
        if (!eventData.flyers) throw new HttpException(400, 'flyers is required');
        if (!eventData.location) throw new HttpException(400, 'location is required');

        // Verificar se já existe evento no mesmo local e horario

        const verifyEvent = await this.eventRepository.findByLocationAndDate(eventData.location, eventData.date);
        if (verifyEvent) throw new HttpException(400, 'Event already exists');

        const cityName = await this.getCityNameByCoordinates(
            eventData.location.latitude,
            eventData.location.longitude,
        )
        eventData = {
            ...eventData,
            city: cityName
        };
        const result = await this.eventRepository.add(eventData);
        return result;
    }

    async findEventByLocation(latitude: string, longitude: string) {
        const cityName = await this.getCityNameByCoordinates(latitude, longitude);
        const findEventsByCity = await this.eventRepository.findEventsByCity(cityName)
        // fórmula de haversine
        const eventWithRadius = findEventsByCity.filter(event =>{
           const distance = this.calculateDistance(
            Number(latitude),
            Number(longitude),
            Number(event.location.latitude),
            Number(event.location.longitude)
           )
           return distance <= 3
        })
        return eventWithRadius;
        

    }

    async findEventsByCategory(category: string){
        if(!category) throw new HttpException(400,'Category is required');
        
      const events = await this.eventRepository.findEventsByCategory(category)

      return events;
    }

    private async getCityNameByCoordinates(latitude: string, longitude: string) {
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyD4Z5Qy25wJG5XMiVl6pYBbknhgUdMioFU`
            );

            if (response.data.status === 'OK' && response.data.results.length > 0) {
                const address = response.data.results[0].address_components
                const citytype = address.find((type: any) => type.types.includes('administrative_area_level_2') && type.types.includes('political'));

                return citytype.long_name
            }
            throw new HttpException(404, 'city not found');
        } catch (error) {
            throw new HttpException(401, 'Error request city name');
        }
    }

    private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {

        var R = 6371; // Raio da Terra em quilômetros
        var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
        var dLon = this.deg2rad(lon2 - lon1);
        var a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distancia em KM
        return d;
    }

    private deg2rad(deg: number) {
        return deg * (Math.PI / 180)
    }
}

export { EventUseCase };
