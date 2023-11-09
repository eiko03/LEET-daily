// import {storage} from "./var";

console.log(1);
// document.addEventListener("DOMContentLoaded", async event =>  {
//     console.log(1);
//    async function run() {
//         await get_plugin_status().then(async (data)=>{
//             console.log(data);
//             if (typeof data.plugin_status === 'undefined') {
//                 await save_plugin_status(active,()=>{
//                     chrome.runtime.sendMessage({updatePopup: true, update: "switch", data: ""});
//                     console.log("off");
//                 })
//             } else if(data.plugin_status === false) {
//                 chrome.runtime.sendMessage({updatePopup: true, update: "switch", data: ""});
//                 console.log("off");
//             }
//             else{
//                 chrome.runtime.sendMessage({updatePopup: true, update: "switch", data: "checked"});
//                 console.log("on");
//
//             }
//         });
//     }
//
//     function get_plugin_status() {
//
//         return storage.get('plugin_status');
//     }
//
//     function save_plugin_status(value){
//
//         storage.remove('plugin_status',function() {
//             storage.set({
//                 'plugin_status': value
//             });
//         });
//
//
//     }
//
//     await run();
// });