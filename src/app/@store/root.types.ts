import { LocalConfig } from '../@shared/config.service';
import { IRequestsState } from '../requests/store/state';

export interface IAppState {
    config?: LocalConfig;
    requests?: IRequestsState;

    routes?: any;
}
