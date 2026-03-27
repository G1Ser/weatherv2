import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { configureSvgIcon } from './lib/svgIcon';

configureSvgIcon({ basePath: '/svgs' });

bootstrapApplication(App, appConfig);
