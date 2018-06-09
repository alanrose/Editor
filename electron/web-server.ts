import * as Koa from 'koa';
import * as KoaBodyParser from 'koa-bodyparser';

import StorageRouter from './routes/storage';

export default class WebServer {
    // Public members
    public application: Koa;
    
    /**
     * Constructor
     * @param port: the port
     */
    constructor (port: number) {
        this.application = new Koa();
        this.application.use(KoaBodyParser());
        this.application.listen(port, 'localhost');

        new StorageRouter(this.application);
    }
}