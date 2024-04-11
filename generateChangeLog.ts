import { exec } from 'child_process';

async function getLastReleaseTag(): Promise<string | null> {
    return new Promise<string | null>((resolve, reject) => {
        exec('git describe --abbrev=0 --tags', (error, stdout) => {
            if (error) {
                console.error('Error fetching last release tag:', error);
                resolve(null);
            } else {
                const tag = stdout.trim();
                resolve(tag);
            }
        });
    });
}

// Example usage
getLastReleaseTag().then(tag => {
    if (tag) {
        console.log('Last release tag:', tag);
    } else {
        console.log('No release tags found.');
    }
});
