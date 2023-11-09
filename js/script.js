

// var port = chrome.runtime.connect({name: "script_to_background"});
// port.onMessage.addListener(function (answer) { /* your code */ });
// port.postMessage({cmd: "shutdown"});



var checkbox = document.getElementById("switch");

checkbox.addEventListener('change', function() {
    if (this.checked) {
        console.log("Checkbox is checked..");
        save_plugin_status(true);
    } else {
        save_plugin_status(false);
        console.log("Checkbox is not checked..");
    }
});




async function run () {
    await get_plugin_status().then(async (data) => {

        if (typeof data.plugin_status === 'undefined') {
            await save_plugin_status(false, () =>
                flip_main_switch(false))
        } else if (data.plugin_status === false)
            flip_main_switch(false);

        else
            flip_main_switch(true);

    });


    await get_local_leet_user_globaldata().then(async (data) => {
        if (typeof data.username !== 'undefined')
            set_username(data.username)
    });

    await get_local_leet_user_progress_list().then(async (data) => {
        if (typeof data.time !== 'undefined'){
            const now = new Date();
            let solved_date = data.time.split("T")[0];
            let current_date = now.getUTCFullYear() +"-"+(now.getUTCMonth() +1) +"-"+now.getUTCDate();
            (solved_date === current_date) ? solved_today("YES") : solved_today("NO");
            set_time(solved_date+" UTC")
        }

    });


    await get_local_leet_problems_solved().then(async (data) => {
        if (typeof data.solved !== 'undefined')
            set_solved(data.solved)
    });

}
function flip_main_switch(val){
    document.getElementById("switch").checked = val
}

function set_username(val){
    document.getElementById("username").value = val
}
function set_solved(val){
    document.getElementById("solved").value = val
}
function solved_today(val){
    document.getElementById("today").value = val
}
function set_time(val){
    document.getElementById("time").value = val
}

function get_plugin_status() {

    return chrome.storage.local.get('plugin_status');
}

function save_plugin_status(value){

    chrome.storage.local.remove('plugin_status',function() {
        chrome.storage.local.set({
            'plugin_status': value
        });
    });

}

function get_local_leet_user_globaldata() {

    return  chrome.storage.local.get('username');

}

function get_local_leet_user_progress_list() {

    return  chrome.storage.local.get('time');

}

function get_local_leet_problems_solved() {

    return  chrome.storage.local.get('solved');

}


run();







