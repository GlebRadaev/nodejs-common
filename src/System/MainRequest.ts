import { Request } from 'express';
import { ErrorSys } from '@a-a-game-studio/aa-components/lib';

import { UserSys } from './UserSys';
import { ResponseSys } from './ResponseSys';
import { SeoBase } from '../Components/Seo';
import { LogicSys } from './LogicSys';
import { CacheSys } from './CacheSys';
import { AccessSys } from './AccessSys';
import { Knex } from 'knex';

export interface MainRequest extends Request {
	headers: { [key: string]: any };
	body: any;
	method: string;
	auth: {
		algorithm: string;
		secret: string;
		auth_url: string;				// URL сервиса авторизации
	};
	common: { 							// Общее
		env: string; 					// Тип окружения
		oldCoreURL: string; 			// URL адрес основного сайта
		nameApp: string;				// Имя приложения
		errorMute: boolean;
		hook_url_errors: string; 		// Сообщения об ошибках mattermost
		hook_url_monitoring: string; 	// Сообщения мониторинга в mattermost
		hook_url_front_errors: string; 	// Сообщения мониторинга ошибок в mattermost FRONT
		hook_url_errors_api: string; 	// Сообщения мониторинга ошибок в mattermost API
		port: number; 					// порт на котором будет работать нода
	};
	sys: {
		apikey: string;
		bMasterDB: boolean; // Для запроса использовать мастер соединение
		bCache?: boolean; // Управление кешированием Вкл/Выкл

		errorSys: ErrorSys;
		userSys: UserSys;
		responseSys: ResponseSys;
		logicSys: LogicSys; // Система логики управления приложением
		cacheSys: CacheSys; // Система кеширования
		accessSys: AccessSys;
		seo?: SeoBase;
	};
	infrastructure: {
		mysql: Knex;
		mysqlMaster: Knex;
		sphinx?: Knex; // Соединение sphinx
		redis: any;
		rabbit: any;
		sphinxErrors?: Knex; // Соединение sphinx c ошибками
	};
	errorType?: number; // тип ошибки
}

const Req: any = {
	headers: null,
	common: { 								// Общее
		env: 'dev', 						// Тип окружения
		oldCoreURL: null, 					// URL адрес основного сайта
		nameApp: 'default',
		errorMute: true,
		hook_url_errors: 'https://', 		// Сообщения об ошибках mattermost,
		hook_url_errors_api: null,		// Сообщения мониторинга ошибок в mattermost API
		hook_url_monitoring: 'https://', 	// Сообщения мониторинга в mattermost
		hook_url_front_errors: 'https://', 	// Сообщения мониторинга ошибок в mattermost
		port: 3005, 						// порт на котором будет работать нода
	},
	sys: {
		apikey: '',
		bAuth: false, 			// флаг авторизации
		bMasterDB: false, 		// По умолчанию используется maxScale
		bCache: true, 			// По умолчанию кеш используется

		errorSys: null, 		// Система ошибок
		userSys: null, 			// Система пользователя
		responseSys: null, 		// Система формирвания ответа
		logicSys: null, 		// Система логики управления приложением
		cacheSys: null, 		// Система кеширования\
		accessSys: null,
	},
	infrastructure: {
		mysql: null, 			// коннект к балансеру БД
		mysqlMaster: null, 		// конект к мастеру
		sphinx: null,
		redis: null,
		rabbit: null,
		sphinxErrors: null,
	},
};

export const devReq = Req;

/**
 * Инициализация MainRequest для консольных запросов
 * @param conf
 */
export function initMainRequest(conf: any): MainRequest {
	const mainRequest: MainRequest = devReq;

	mainRequest.sys.errorSys = new ErrorSys(conf.common.env);
	if (conf.common.errorMute) { // Настройка режим тищины
		mainRequest.sys.errorSys.option({
			bMute: true,
		});
	}

	return mainRequest;
}

/** Типы ошибок */
export enum TError {
	None = 0,
	PageNotFound = 404,
	Api = 1,
	AllBad = 500,
	AccessDenied = 403,
}
