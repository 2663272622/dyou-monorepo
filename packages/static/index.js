import editor from './Editor'


export const rEditor = editor


import plugins from './utils/js/plugin'
import toolbar from './utils/js/toolbar'
import load from './utils/js/dynamicLoadScript'
import { processHtmlContent,HandleReUnDo } from './utils/js/utils'
import { fontSettings } from './utils/js/fontConfig'; // 引入字体配置

export {
    plugins,
    toolbar,
    load,
    processHtmlContent,
    HandleReUnDo,
    fontSettings, 
}