/**
 * Created by Talmaj on 13/07/17.
 */

function processDescription(description) {
    //return "<p>" + description.split("\n").join("</p><p>") + "</p>";
    return description.split("\n").join("<br>");
}

function processLinks(description) {
    const re = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/g
    const links = description.match(re);

    if (links) {
        for (let i = 0; i < links.length; i++) {
            let link = links[i];
            if (link.startsWith('http')) {
                description = description.replace(link, '<a href="' + link + '">' + link + '</a>')
            } else {
                description = description.replace(link, '<a href="http://' + link + '">' + link + '</a>')
            }
        }
    }
    return description;
}

export default function processEvent(event) {
    event.description = processLinks(event.description);
    event.description = processDescription(event.description);
    event.start_time = new Date(event.start_time);
    event.end_time = new Date(event.end_time);
    return event
}