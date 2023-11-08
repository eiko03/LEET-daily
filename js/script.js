async function fetchData() {


    var request = $.ajax({
        url: "https://api.covidtracking.com/v1/us/daily.json",
        method: "GET",
        dataType: "json"
    });

    request.done(function (record) {
        document.getElementById("date").innerHTML = record[0].date;
        document.getElementById("areaName").innerHTML = record[0].states;
        document.getElementById("latestBy").innerHTML = record[0].lastModified;
        document.getElementById("deathNew").innerHTML = record[0].deathIncrease;
    });

    request.fail(function (jqXHR, textStatus) {
        console.log(textStatus);
    });


}



async function getCurrentTabUrl() {
    const tabs = await chrome.tabs.query({active: true});
    document.getElementById("deathNew").innerHTML = tabs[0].url;
    return tabs[0].url;
}

fetchData();
getCurrentTabUrl();