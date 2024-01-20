var registerTemplates = {};
var votingTemplates = {};
var adminTemplates = {};
var leaderboardTemplates = {};

Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

registerTemplates.judges = Handlebars.compile(`
{{#each judges}}
<input type="radio" id="judge-name-{{@index}}" name="choose-judge" value="{{this.name}}" {{#ifEquals ../judges.length 1}}checked{{/ifEquals}}>
<label for="judge-name-{{@index}}">{{this.name}}</label>
{{/each}}
`)

registerTemplates.countries = Handlebars.compile(`
{{#each countries}}
<details class="country-container">
<summary>{{this.name}}</summary>
<div class="country-content"></div>
</details>
{{/each}}
`)

votingTemplates.countries = Handlebars.compile(`
{{#each countries}}
<details class="voting-country-container">
    <summary>
        <div class="left-container">
            <p>03</p>
            <img src="/client/resources/images/flags/gr.svg" width="55px">
            <p class="country-name">GREECE</p>
        </div>
        <div class="right-container">
            <p class="my-vote">10</p>
            <p class="total-votes">30</p>
        </div>
    </summary>
    <div class="voting-country-content"></div>
</details>
{{/each}}
`);

votingTemplates.countryContent = Handlebars.compile(`
{{#each points}}
<input type="radio" id="point{{this}}" name="choose-vote" value="{{this}}">
<label for="point{{this}}">{{this}}</label>
{{/each}}
<button>VOTE</button>
`);

adminTemplates.countries = {};

adminTemplates.countries.formInputsArea = `
<div class="text-input-container" id="code-container">
    <label for="code-txt">Code</label>
    <input type="text" id="code-txt" name="code-txt" required>
</div>

<div class="text-input-container" id="name-container">
    <label for="name-txt">Name</label>
    <input type="text" id="name-txt" name="name-txt" required>
</div>

<div class="checkbox-input-container" id="qualified-container">
    <label for="qualified-cbx">Qualified</label>
    <input type="checkbox" id="qualified-cbx" name="qualified-cbx">
</div>

<div class="number-input-container" id="runningorder-container">
    <label for="runningorder-nmbr">Running order</label>
    <input type="number" id="runningorder-nmbr" name="runningorder-nmbr" required>
</div>

<div class="color-picker-input-container" id="flagcolor1-container">
    <label for="flagcolor1-txt">Flag color 1</label>
    <div class="color-picker-container">
        <input type="text" id="flagcolor1-txt" name="flagcolor1-txt">
        <input type="color" id="flagcolor1-cp" name="flagcolor1-cp">
    </div>
</div>

<div class="color-picker-input-container" id="flagcolor2-container">
    <label for="flagcolor2-txt">Flag color 2</label>
    <div class="color-picker-container">
        <input type="text" id="flagcolor2-txt" name="flagcolor2-txt">
        <input type="color" id="flagcolor2-cp" name="flagcolor2-cp">
    </div>
</div>

<div class="color-picker-input-container" id="flagcolor3-container">
    <label for="flagcolor3-txt">Flag color 3</label>
    <div class="color-picker-container">
        <input type="text" id="flagcolor3-txt" name="flagcolor3-txt">
        <input type="color" id="flagcolor3-cp" name="flagcolor3-cp">
    </div>
</div>

<div class="text-input-container" id="song-container">
    <label for="song-txt">Song</label>
    <input type="text" id="song-txt" name="song-txt" required>
</div>

<div class="text-input-container" id="artist-container">
    <label for="artist-txt">Artist</label>
    <input type="text" id="artist-txt" name="artist-txt" required>
</div>
`;

adminTemplates.countries.countryContainer = Handlebars.compile(`
{{#each countries}}
<div class="country-container" id="{{this.code}}">
<h1>{{this.name}}</h1>
<h2>{{this.runningOrder}}</h2>
<h3>{{this.song}} | {{this.artist}}</h3>
</div>
{{/each}}
`);

adminTemplates.judges = {};

adminTemplates.judges.formInputsArea = `
<div class="text-input-container" id="name-container">
    <label for="name-txt">Name</label>
    <input type="text" id="name-txt" name="name-txt" required>
</div>

<div class="text-input-container" id="origincountry-container">
    <label for="origincountry-txt">Origin Country</label>
    <input type="text" id="origincountry-txt" name="origincountry-txt" required>
</div>
`;

adminTemplates.judges.judgeContainer = Handlebars.compile(`
{{#each judges}}
<div class="judge-container" id="{{this.name}}">
<h1>{{this.name}}</h1>
<h2>{{this.judgesOrigin}}</h2>
</div>
{{/each}}
`);

export {registerTemplates, adminTemplates};