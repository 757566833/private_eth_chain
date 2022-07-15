
import createTextIcon, {IIconType} from '../create-icon';
import {insertCss} from '../_util';
import {EEnv, Env} from '../env';
export interface IModalParams{
    title?:string;
    content?:string;
    onOk?:()=>void
    okText?:string;
    // type:Exclude<IIconType, 'loading'>
}
type IType = Exclude<IIconType, 'loading'>;
/**
 * 仅为了某些地方和第三方库结偶，不要用到业务里面
 */
export class modal {
    static map: { [key: string]: HTMLDivElement } = {}
    static loop: HTMLDivElement[] = []
    static body =global?.document?.body||{};
    /**
     *
     */
    constructor() {
      //

    }
    static success: (params:IModalParams) => string|undefined = (params) => {
      return modal.addModal(params, 'success');
    }
    static error: (params:IModalParams) => string|undefined = (params) => {
      return modal.addModal(params, 'error');
    }
    static info: (params:IModalParams) => string|undefined = (params) => {
      return modal.addModal(params, 'info');
    }
    static warning: (params:IModalParams) => string|undefined = (params) => {
      return modal.addModal(params, 'warning');
    }
    static addModal: (params:IModalParams, type:IType) => string|undefined = (params, type) => {
      insertCss();
      const env = Env.getEnv();
      if (env==EEnv.client) {
        const [mask, modalContent, tag] = modal.createDom(globalThis.document, params, type);
        modal.addDom(mask, modalContent, tag);
        return tag;
      } else {
        console.error(`${params.title}:${params.content}`);
      }
    }


    static createMask:(document:Document)=>HTMLDivElement = (document)=>{
      const dom = document.createElement('div');
      dom.style.position = 'absolute';
      dom.style.width = '100%';
      dom.style.height = '100%';
      dom.style.top = '0';
      dom.style.left = '0';
      dom.style.display = 'flex';
      dom.style.justifyContent = 'center';
      dom.style.transition = 'all 0.28s';
      dom.style.background='#88888800';
      return dom;
    }
    static createModalContent:(document:Document, params: IModalParams, type:IIconType, tag:string)=>HTMLDivElement = (document, params, type, tag)=>{
      const icon = createTextIcon(type);
      const modalContent = document.createElement('div');
      modalContent.style.minHeight = '164px';
      modalContent.style.width = '417px';
      modalContent.style.display = 'flex';
      modalContent.style.lineHeight = '20px';
      modalContent.style.background = '#fff';
      modalContent.style.boxShadow = '0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%)';
      modalContent.style.borderRadius = '4px';
      modalContent.style.top='-200px';
      modalContent.style.position='absolute';
      modalContent.style.transition = 'all 0.28s';
      const button = document.createElement('button');
      button.style.color = '#ffffff';
      button.style.background = '#1890ff';
      button.style.border = 'none';
      button.style.padding = '6px';
      button.style.outline = 'none';
      button.style.borderRadius='4px';
      button.onclick = ()=> {
        modal.destroy(tag);
        params.onOk&&params.onOk();
      };
      button.onmouseover= ()=>{
        button.style.opacity='0.8';
      };
      button.onmouseleave=()=>{
        button.style.opacity='1';
      };
      button.innerText=params.okText||'确定';
      const buttonParent = document.createElement('div');
      buttonParent.style.display='flex';
      buttonParent.style.justifyContent='flex-end';
      buttonParent.appendChild(button);
      const content = document.createElement('div');
      content.style.padding='32px';
      content.style.width='100%';
      content.style.flex='1';
      content.innerHTML=`<div style="display: flex;min-height: 78px">
                                <div style="font-size: 26px">
                                    ${icon}
                                </div>
                                <div style="width: 22px"></div>
                                <div>
                                    <div style="font-weight: 500;font-size: 16px;line-height: 1.4">
                                        ${params.title||''}
                                    </div>
                                    <div style="height: 8px" ></div>
                                    <div style="font-size: 14px">
                                        ${params.content||''}
                                    </div>
                                </div>
                            </div>`;
      content.appendChild(buttonParent);
      // const contentText = document.createElement('div');
      // contentText.innerText = params.content||'';
      //
      // const titleText = document.createElement('div');
      // titleText.innerText = params.title||'';
      //
      // const space = document.createElement('div');
      // space.style.width='22px'


      // const content = `<div style="padding: 32px;width: 100%;flex:1">
      //                     <div style="display: flex;min-height: 78px">
      //                         <div style="font-size: 26px">
      //                             ${icon}
      //                         </div>
      //                         <div style="width: 22px"></div>
      //                         <div>
      //                             <div style="font-weight: 500;font-size: 16px;line-height: 1.4">
      //                                 ${params.title||''}
      //                             </div>
      //                             <div style="height: 8px" ></div>
      //                             <div style="font-size: 14px">
      //                                 ${params.content||''}
      //                             </div>
      //                         </div>
      //                     </div>
      //                     <div style="display: flex;justify-content: flex-end">
      //                         ${button}
      //                     </div>
      //                 </div>`
      modalContent.appendChild(content);
      return modalContent;
    }
    static createDom: (document:Document, params: IModalParams, type: IIconType) => [HTMLDivElement, HTMLDivElement, string] = (document, params, type) => {
      const tag = new Date().getTime().toString()+Number.parseInt(`${Math.random()*100}`, 0);
      const mask = modal.createMask(document);
      const modalContent = modal.createModalContent(document, params, type, tag);
      return [mask, modalContent, tag];
    }
    static addDom: (mask:HTMLDivElement, modalContent: HTMLDivElement, tag:string) => string = (mask, modalContent, tag) => {
      mask.appendChild(modalContent);
      const length = modal.loop.length;
      let zIndex = '999999';
      if (length != 0) {
        zIndex = `${parseInt(modal.loop[length - 1].style.zIndex) + 1}`;
      }
      mask.style.zIndex = zIndex;
      setTimeout(() => {
        modalContent.style.top = `100px`;
        mask.style.background = `rgba(0,0,0,0.5)`;
      }, 50);

      modal.loop.push(mask);
      modal.map[tag] = mask;
      modal.body.appendChild(mask);
      return tag;
    }
    static removeDom = (domTag: string) => {
      const dom = modal.map[domTag];
      if (dom) {
        const length = modal.loop.length;
        for (let i = 0; i < length; i++) {
          if (modal.loop[i] == dom) {
            modal.loop = [...modal.loop.slice(0, i), ...modal.loop.slice(i + 1)];
            break;
          }
        }
        delete modal.map[domTag];
        dom.style.opacity = '0';
        setTimeout(() => {
          dom.remove();
        }, 280);
      }
    }
    static destroy :(tag?:string)=>void=(tag)=>{
      if (tag) {
        modal.removeDom(tag);
      } else {
        for (const tagKey in modal.map) {
          if (modal.map.hasOwnProperty(tagKey)) {
            modal.removeDom(tagKey);
          }
        }
      }
    }
}

export default modal;
