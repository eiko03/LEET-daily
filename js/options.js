var btn = document.getElementById("whitelist_btn");
var btn_delete = document.getElementById("whitelist_delete_btn");
/**
 * whitelist url add or delete on save
 */
btn.addEventListener('click', async function() {

    var lines =document.getElementById("whitelist").value.split('\n');
    let res="";
    for(var i = 0;i < lines.length;i++){
        let arr= domain_from_url(lines[i]).split('.');
        res += String.raw`|.*:\/\/.*`+arr[0]+String.raw`\.`+arr[1]+String.raw`\/.*`;

    }

    await save_whitelist_url(res,()=>{
        console.log("done");
    });
});


btn_delete.addEventListener('click', async function() {


    await remove_whitelist_url();
});


async function run (){
    await get_whitelist_url().then( (data)=>{
        if(typeof data.whitelist_url !== 'undefined')
            white_listed_update(data.whitelist_url)

    })
}


function domain_from_url(url) {
    var result
    var match
    if (match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im)) {
        result = match[1]
        if (match = result.match(/^[^\.]+\.(.+\..+)$/)) {
            result = match[1]
        }
    }
    return result
}

async function save_whitelist_url(value){

    await get_whitelist_url().then( async (data)=>{
        if(typeof data.whitelist_url !== 'undefined'){

            value = data.whitelist_url+value
        }

            await chrome.storage.local.set({
                'whitelist_url' :  value
            });

            white_listed_update(value);


    });


}
function remove_whitelist_url(value){

    chrome.storage.local.remove('whitelist_url',function() {
        document.getElementById("whitelist_listed").value="";
    });


}

function get_whitelist_url() {

    return  chrome.storage.local.get('whitelist_url');

}

function regex_to_nominal(data){
    return data.replaceAll(String.raw`.*:\/\/.*`,'')
        .replaceAll(String.raw`|`,"\n")
        .replaceAll(String.raw`\/.*`,'')
        .replaceAll(String.raw`\.`,'.');
}

function white_listed_update(data){
    document.getElementById("whitelist_listed").value=regex_to_nominal(data);
    document.getElementById("whitelist").value="";
}

run()