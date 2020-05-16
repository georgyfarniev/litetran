import { session, Rectangle} from 'electron'

export interface WindowGeometry {

}
export interface IConfig {
  geometry: Partial<Rectangle>
}

const CONFIG_EXPIRATION_DATE = 2147483647
const APP_URL='http://localhost/litetran/'

const DEFAULT_CONFIG: IConfig = {
  geometry: {
    height: 300,
    width: 300
  }
}

export class Config {
  public async read(): Promise<IConfig> {
    const [cookie] = await session.defaultSession.cookies.get({ url: APP_URL })

    return cookie && cookie.value
      ? JSON.parse(cookie.value)
      : DEFAULT_CONFIG
  }

  public async save(config: Partial<IConfig>): Promise<void> {
    await session.defaultSession.cookies.set({
      url: APP_URL,
      value: JSON.stringify(config),
      expirationDate: CONFIG_EXPIRATION_DATE
    })
  }
}