export class JobInfo {
    url: string;
    classification: Array<string>;

    public constructor(url: string = "", classification: Array<string> = []) {
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