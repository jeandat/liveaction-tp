import SpyObj = jasmine.SpyObj;
import { SiteService } from '../app/site/site-service/site.service';

export const siteServiceStub:SpyObj<SiteService> = jasmine.createSpyObj('siteServiceStub', ['getList', 'get']);
