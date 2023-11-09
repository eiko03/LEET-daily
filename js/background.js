import {url, cookie_data, whitelisted_url, storage,query, methods} from './var.js'

var csrf = null;
var session = null;
var username = null;
var solved = null;
var time = null;
var question = null;
var current_utc_date = null;
var last_submit_utc_date = null;
var active = true;



chrome.webNavigation.onCompleted.addListener(async (e) => {
    await get_whitelist_url().then(data=>{
        let reg=whitelisted_url.REGEX;
        if(typeof data.whitelist_url !== 'undefined')
            reg=whitelisted_url.REGEX+data.whitelist_url;

        var regex = new RegExp(reg);

        chrome.tabs.query(
            {currentWindow: true, active : true},
            async function(tabId){

                try{
                    if(tabId[0].url.match(regex)){
                        console.log(1);
                    }
                    else {
                        await get_plugin_status().then(async (data)=>{
                            if(data.plugin_status === true){
                                await search_cookies();
                            }
                        });

                    }
                }
                catch (e){
                    console.log(e);
                }

            }
        )


    });




});





// chrome.runtime.onConnect.addListener(function (port) {
//     port.onMessage.addListener(function (request) {
//         if (request.cmd === "shutdown") {
//             console.log('ss');
//         }
//     });
// });

// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse){
//         if(request.msg == "startFunc") console.log("111");
//     }
// );


/**
 *  helper
 *
 */

async function redirect(uri = null){
    await get_whitelist_url().then(data=>{

        let reg=whitelisted_url.REGEX;
        if(typeof data.whitelist_url !== 'undefined')
            reg=whitelisted_url.REGEX+data.whitelist_url;

        var regex = new RegExp(reg);


        chrome.tabs.query(
            {currentWindow: true, active : true},
            function(tabId){
                try{tabId[0].url;} catch(e){uri ? redirect(uri): redirect();}

                if(tabId[0].url.match(regex)){
                    console.log(1);
                }
                else {

                    chrome.tabs.update(tabId[0].id, {url: (uri)?(url.BASE_URL+uri) : (url.LOGIN_URL)});
                }

            }
        )
    });


}

function compareTwoDates(d1, d2) {
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    return date1 - date2;
}

/**
 * getter of localstorage
 *
 */
function get_whitelist_url() {

    return  chrome.storage.local.get('whitelist_url');

}
function get_plugin_status() {

    return chrome.storage.local.get('plugin_status');
}
function get_gookies_session() {

    return storage.get(cookie_data.SESSION);
}

function get_gookies_csrf() {

    return  storage.get(cookie_data.CSRF);

}

function get_local_leet_user_globaldata() {

    return  storage.get('username');

}

function get_local_leet_problems_solved() {

    return  storage.get('solved');

}

function get_local_leet_user_progress_list() {

    return  storage.get('time');

}

function get_local_leet_problem_question_list() {

    return  storage.get('question');

}

/**
 * setter of localstorage
 *
 */


function save_cookies_session(value){

    storage.remove('LEETCODE_SESSION',function() {
        storage.set({
            'LEETCODE_SESSION' : [{
                val: value
            }]
        });
    });


}

function save_cookies_csrf(value){
    storage.remove('csrftoken',function() {
        storage.set({
            'csrftoken': [{
                val: value,
            }]
        });
    });
}

function save_leet_user_globaldata(value){
    storage.remove('username',function() {
        storage.set({
            'username': value
        });
    });
}

function save_leet_user_problems_solved(value){
    storage.remove('solved',function() {
        storage.set({
            'solved': value
        });
    });
}

function save_leet_user_progress_list(value){
    storage.remove('time',function() {
        storage.set({
            'time': value
        });
    });
}
function save_leet_problem_question_list(value){
    storage.remove('question',function() {
        storage.set({
            'question': value
        });
    });
}


/**
 * primary function
 * @returns {Promise<void>}
 */


async function search_cookies(){

    await chrome.cookies.get({ url: url.BASE_URL, name: cookie_data.SESSION },
        async function (cookie) {
            if (cookie) {
                await save_cookies_session(cookie.value)
                await chrome.cookies.get({ url: url.BASE_URL, name: cookie_data.CSRF },
                     async function (cookie) {
                        if (cookie) {
                            await save_cookies_csrf(cookie.value);

                            if(!session)
                                session=await get_gookies_session();

                            if(!csrf)
                                csrf=await get_gookies_csrf();

                            if(!username){
                                await get_leet_user_globaldata(csrf.csrftoken[0].val, session.LEETCODE_SESSION[0].val);
                                username = await get_local_leet_user_globaldata();
                            }



                            await get_leet_user_progress_list(csrf.csrftoken[0].val, session.LEETCODE_SESSION[0].val);
                            time = await get_local_leet_user_progress_list();
                            const now = new Date();


                            let datesComparisonResult = compareTwoDates(time.time.split("t")[0], now.getUTCFullYear() +"-"+(now.getUTCMonth() +1) +"-"+now.getUTCDate());

                            if (datesComparisonResult > 0) {
                                console.log(`how did you submit tomorrow!`);
                            } else if (datesComparisonResult < 0) {
                                console.log(`you submitted yesterday`);

                                if(!solved){
                                    await get_leet_user_problems_solved(csrf.csrftoken[0].val, session.LEETCODE_SESSION[0].val);
                                    solved = await get_local_leet_problems_solved();
                                }

                                await get_leet_problem_question_list();
                                question = await get_local_leet_problem_question_list();

                                await redirect(question.question);
                            } else {
                                console.log(`thanks for submit today`);
                            }

                            console.log(question);



                        } else
                            await redirect()
                    });

            }
            else
                await redirect()

        });
}

/**
 *
 * data fetcher
 */



async function get_leet_problem_question_list(csrf, session){
    let variable = query.leet_problem_question_list_vr.replace(`"skip": 0`,`"skip": `+(Math.floor(Math.random() *(2860-solved.solved))))
    try{
        fetch(url.API_URL, {
            method: methods.post,
            headers: header(csrf, session),
            body: body(query.leet_problem_question_list, variable)
        })
            .then((res) => res.json())
            .then((result) =>
                save_leet_problem_question_list(filter_leet_problem_question_list(result))
            );
    }
    catch(e){
        console.log("error "+e)
        await get_leet_problem_question_list(csrf, session)
    }

}
async function get_leet_user_progress_list(csrf, session){

    try{
        fetch(url.API_URL, {
            method: methods.post,
            headers: header(csrf, session),
            body: body(query.leet_user_progress_list, query.leet_user_progress_list_vr)
        })
            .then((res) => res.json())
            .then((result) =>
                save_leet_user_progress_list(filter_leet_user_progress_list(result))
            );
    }
    catch(e){
        console.log("error "+e)
        await get_leet_user_progress_list(csrf, session)
    }

}

async function get_leet_user_globaldata(csrf, session){

    try{
        fetch(url.API_URL, {
            method: methods.post,
            headers: header(csrf, session),
            body: body(query.user_globaldata_query)
        })
            .then((res) => res.json())
            .then((result) =>
                save_leet_user_globaldata(filter_leet_user_globaldata(result))
            );
    }
    catch(e){
        console.log("error "+e)
        await get_leet_user_globaldata(csrf, session)
    }

}

async function get_leet_user_problems_solved(csrf, session){

    try{
        fetch(url.API_URL, {
            method: methods.post,
            headers: header(csrf, session),
            body: body(query.user_problems_solved_query,username)
        })
            .then((res) => res.json())
            .then((result) =>
                save_leet_user_problems_solved(filter_leet_user_problems_solved(result))
            );
    }
    catch(e){
        console.log("error "+e)
        await get_leet_user_problems_solved(csrf, session);
    }

}


/**
 *
 * data fetcher helper
 */
function header(csrf, session){
    return {
        'Content-Type': 'application/json',
        'x-csrftoken': csrf,
        Cookie: 'csrftoken='+csrf+';LEETCODE_SESSION='+session+';'
    }
}

function body(query_data,variable=null){
    let payload = {query: query_data}
    if(variable) payload = {...payload,"variables": variable}
    return JSON.stringify(payload)
}


/**
 *
 * response filter
 */

function filter_leet_user_globaldata(res){
    return res.data.userStatus.username
}
function filter_leet_user_problems_solved(res){
    return res.data.matchedUser.submitStatsGlobal.acSubmissionNum[0].count
}
function filter_leet_user_progress_list(res){
    return res.data.solvedQuestionsInfo.data[0].lastAcSession.time
}
function filter_leet_problem_question_list(res){
    return res.data.problemsetQuestionList.questions[0].questionDetailUrl
}




