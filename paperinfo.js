async function getDataFromArxiv(id) {
    const response = await fetch('https://export.arxiv.org/api/query?id_list=' + id);
    const data = await response.text();
    title = data.split("<title>")[1].split("</title>")[0]
        .replace(/\n/g, ' ')
        .replace(/ +/g, ' ')
        .trim();

    abstract = data.split("<summary>")[1].split("</summary>")[0]
        .replace(/\n/g, ' ')
        .replace(/ +/g, ' ')
        .trim();

    authors = data.substring(data.indexOf("<author>"), data.lastIndexOf("</author>"))
        .replace(/<arxiv:affiliation[^<]*<\/arxiv:affiliation>/g, '')
        .replace(/<\/?author>/g, '').replace(/\n/g, ' ').replace(/ +/g, ' ')
        .replace(/<\/name> <name>/g, ', ').replace(/<\/?name>/g, '')
        .trim();

    return {
        title: title,
        abstract: abstract,
        authors: authors
    };
}

(async () => {
    if (window.location.pathname.indexOf(("/abs/")) !== -1) {
        document.getElementById("paper_info").style.display = "";
        const id = window.location.pathname.split('/abs/')[1];

        if (document.getElementById("paper_title").innerText) {
            // we already have this data, no need to go to arxiv
        } else {
            const output = await getDataFromArxiv(id);
            document.getElementById("paper_title").innerText = output.title;
            document.getElementById("paper_abstract").innerText = output.abstract;
            document.getElementById("paper_authors").innerText = output.authors;
        }

        details = `<a href="https://arxiv.org/abs/${encodeURI(id)}" target="_blank">https://arxiv.org/abs/${encodeURI(id)}</p>`;
        document.getElementById("paper_details").innerHTML = details;

        document.getElementsByTagName("iframe")[0].src = "https://scitldr.apps.allenai.org/?q=" + encodeURIComponent(document.getElementById("paper_abstract").innerText);
        document.getElementById("summarizer").style.display = "";
        document.getElementById("summarizer").style.height = "52px";
        document.getElementById("summarizer").style.overflow = "hidden";
    }
})()

document.getElementById("summarizerbutton").onclick = function() {
    let buttonText = this.innerText;
    let div = document.getElementById("summarizer");
    if (buttonText.indexOf("use") !== -1) {
        div.style.height = 'auto';
        this.innerText = buttonText.replaceAll("use", "hide");
    } else {
        div.style.height = '52px';
        this.innerText = buttonText.replaceAll("hide", "use");
    }
}

document.getElementById("summarizerbutton").style.cursor = "pointer";