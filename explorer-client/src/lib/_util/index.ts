import {Env} from '../env';
import {css} from '../create-icon';

/**
 * 异步导入css  存放数据的地方
 */
export class DynamicCssDB {
    static isMount=false
    public static STYLE_ID = 'lib-util-icon'

    /**
     * 设置是否已经挂载
     * @param isMount
     */
    public static setIsMount(isMount:boolean) {
      DynamicCssDB.isMount = isMount;
    }

    /**
     * 判断是否已经挂载
     */
    public static getIsMount() {
      return DynamicCssDB.isMount;
    }
}
export const insertCss = ()=>{
  Env.inClient(()=>{
    if (!DynamicCssDB.getIsMount()) {
      const style = document.createElement('style');
      style.innerHTML = css;
      style.id = DynamicCssDB.STYLE_ID;
      document.body.appendChild(style);
      DynamicCssDB.setIsMount(true);
    }
  });
};
