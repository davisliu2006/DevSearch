export let tagCategories: Array<[string, Array<string>]> = [
    ["software", ["software"]],
    ["web", ["web", "web-dev"]],
    ["frontend", ["frontend", "front-end", "front end"]],
    ["backend", ["backend", "back-end", "back end"]],
    ["embedded", ["embedded", "firmware"]],
    ["system", ["operating system"]],
    ["c++", ["c++"]],
    ["java", ["java"]],
    ["javascript", ["javascript", "typescript"]],
    ["c#", ["c#", ".net"]]
]

export class JobInfo {
    title: string;
    url: string;
    classification: Array<string>;

    public constructor(title: string = "", url: string = "", classification: Array<string> = []) {
        this.title = title;
        this.url = url;
        this.classification = classification;
    }
    public get_tags() {
        let tags: Array<string> = [];
        this.classification.forEach(function(name) {
            tags.push(name);
        });
        return tags;
    }
}

export class JobData {
    jobsFound: Array<JobInfo>;

    constructor(jobsFound: Array<JobInfo> = []) {
        this.jobsFound = jobsFound;
    }
}