const airlines = ["Vistara", "GoAir", "IndiGo", "SpiceJet", "Air India", "Air Asia India"]

function generateTime() {
    let fHours = Math.floor(Math.random() * 24);
    let durationHours = Math.floor(Math.random() * 7) + 3;
    let tHours = fHours + durationHours;
    if (tHours >= 24) tHours -= 24;

    let fMins = Math.floor(Math.random() * 60);
    let durationMins = Math.floor(Math.random() * 60);
    let tMins = fMins + durationMins;
    if (tMins >= 60) tMins -= 60;

    fHours = fHours.toLocaleString("en-US", {minimumIntegerDigits: 2, useGrouping:false});
    fMins = fMins.toLocaleString("en-US", {minimumIntegerDigits: 2, useGrouping:false});
    tHours = tHours.toLocaleString("en-US", {minimumIntegerDigits: 2, useGrouping:false});
    tMins = tMins.toLocaleString("en-US", {minimumIntegerDigits: 2, useGrouping:false});

    return [ fHours+":"+fMins, tHours+":"+tMins ];
}

function generateDetails(from, to, date, passengerCount, group) {
    let details = [];

    for (let index = 0; index < 7; index++) {
        const detail = { from, to, date, passengerCount, group };

        detail.airline = airlines[Math.floor(Math.random() * airlines.length)];
        detail.price = Math.floor(Math.random() * 7000) + 3000;
        [ detail.fromTime, detail.toTime ] = generateTime();

        details.push(detail);
    }
    
    return details;
}


module.exports = { generateDetails };