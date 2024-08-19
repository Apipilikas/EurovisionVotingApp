let FileUtils = { };

const basePath = "../resources/";

export const PageDirectory = {
    Admin_Countries : "admin/countries/",
    Admin_Judges : "admin/judges/",
    Admin_Voting : "admin/voting/",
    Register : "register/",
    Leaderboard : "leaderboard/",
    Voting : "voting/",
    General : "general/"
}

const Directory = {
    Translations : "translations/"
}

FileUtils.getTranslationFullPath = function(pageDir) {
    return `${basePath}${Directory.Translations}${pageDir}`;
}

FileUtils.getTranslationFilePath = function(pageDir, language) {
    let fullPath = FileUtils.getTranslationFullPath(pageDir);
    return `${fullPath}${language}.json`;
}

FileUtils.getCurrentTranslationFilePath = function(language) {
    let pageDir = FileUtils.resolveCurrentURL();
    return FileUtils.getTranslationFilePath(pageDir, language);
}

/**
 * Gets page directory based on current URL.
 * @returns 
 */
FileUtils.resolveCurrentURL = function() {
    let currentURL = window.location.href;

    if (currentURL.includes("register.html")) return PageDirectory.Register;
}

export {FileUtils};