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
    title: string = "";
    url: string = "";
    classification: Array<string> = [];
    posTitle: string = "";
    location: string = "";
    compensation: string = "";
    description: string = "";

    public constructor(title: string = "", url: string = "", classification: Array<string> = []) {
        this.title = title;
        this.url = url;
        this.classification = classification;
    }
}

export class JobData {
    jobsFound: Array<JobInfo> = [];

    constructor(jobsFound: Array<JobInfo> = []) {
        this.jobsFound = jobsFound;
    }
}

export class DomainInfo {
    url: string = "";
    title: string = "";
    location: string = "";
    compensation: string = "";
    description: string = "";

    constructor() {}
}