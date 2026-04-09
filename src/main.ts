import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { configureSvgIcon } from './lib/svgIcon';
import getGitInfo from './utils/git';
import performanceMonitor from './utils/performance';
import { environment } from './environments/environment.dev';

configureSvgIcon({ basePath: '/svgs' });
if (environment.production) {
  getGitInfo();
  performanceMonitor.init();
}
bootstrapApplication(App, appConfig);
