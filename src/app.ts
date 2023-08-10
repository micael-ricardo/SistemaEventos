import express, { Application } from 'express'
import { connect } from './infra/database';
import { erroMiddleware } from './middlewares/error.middleware';
import { EventRouts } from './routes/event.routes';

class App {
    public app: Application;
    private eventRouts = new EventRouts
    constructor() {
        this.app = express();
        this.middlewaresInitialize();
        this.initializeRoutes();
        this.interceptionError();
        connect();
    }
    private initializeRoutes() {
        this.app.use('/events', this.eventRouts.router)
    }
    private interceptionError() {
        this.app.use(erroMiddleware);
    }
    private middlewaresInitialize() {
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }));
    }
    listen() {
        this.app.listen(3333, () => console.log('server is running'))
    }

}
export { App };