import { FileUtils, PageDirectory } from "../fileUtils.js";

export class Language {
    constructor(id, name, country) {
        this.id = id;
        this.name = name;
        this.country = country;
    }

    static getGreekLanguage() {
        return new Language("gr", "Greek", "Greece");
    }

    static getEnglishLanguage() {
        return new Language("en", "English", "USA");
    }
}

export class TranslationManager {

    #translations

    /**
     * TranslationManager constructor
     * @param {Language} language 
     */
    constructor(language) {
        this.language = language;
        this.filePath = FileUtils.getCurrentTranslationFilePath(this.language.id);
    }

    /**
     * Gets greek translation manager.
     */
    static getGreekManager() {
        return new TranslationManager(Language.getGreekLanguage());
    }

    /**
     * Gets english translation manager.
     */
    static getEnglishManager() {
        return new TranslationManager(Language.getEnglishLanguage());
    }

    async loadFromFile() {
        return this.loadFromSpecificFile(this.filePath);
    }

    async loadFromSpecificFile(file) {
        let generalJson = await fetch(FileUtils.getTranslationFilePath(PageDirectory.General, this.language.id))
        .then(response => response.json())
        .catch(er => {return false});

        let specifiedJson = await fetch(file)
        .then(response => response.json())
        .catch(er => {return false});

        this.#translations = {...generalJson, ...specifiedJson};

        return true;
    }

    getTranslation(id) {
        return this.#translations[id];
    }
}