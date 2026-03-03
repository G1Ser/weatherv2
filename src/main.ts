import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

const app = bootstrapApplication(App, appConfig);
app.catch(err => console.error(err));
