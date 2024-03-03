var registerTemplates = {};
var votingTemplates = {};
var adminTemplates = {};
var leaderboardTemplates = {};
var generalTemplates = {};
var points = [1,2,3,4,5,6,7,8,10,12];

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
{{#each emptyCountries}}
<details class="voting-country-container empty-country-container" style="display:none;">
</details>
{{/each}}
{{#each countries}}
<details class="voting-country-container" countrycode="{{this.code}}">
    <summary>
        <div class="left-container">
            <p>{{this.runningOrder}}</p>
            <img src="/client/resources/images/flags/gr.svg" width="55px">
            <p class="country-name">{{this.name}}</p>
        </div>
        <div class="right-container">
            <p class="my-vote">10</p>
            <p class="total-votes">{{this.totalVotes}}</p>
        </div>
    </summary>
    <div class="voting-country-content"></div>
</details>
{{/each}}
`);

votingTemplates.votingContent = Handlebars.compile(`
{{#each points}}
<input type="radio" id="point{{this}}" name="choose-vote" value="{{this}}">
<label for="point{{this}}">{{this}}</label>
{{/each}}
<button>VOTE</button>
`);

votingTemplates.votingContent.content = {points: points};

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
    <input class="checkbox" type="checkbox" id="qualified-cbx" name="qualified-cbx">
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
<div class="text-input-container" id="code-container">
    <label for="code-txt">Code name</label>
    <input type="text" id="code-txt" name="code-txt" required>
</div>

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
<div class="judge-container" id="{{this.code}}">
<h1>{{this.name}}</h1>
<h2>{{this.judgesOrigin}}</h2>
</div>
{{/each}}
`);

adminTemplates.voting = {};

adminTemplates.voting.votingCountryContainer = Handlebars.compile(`
{{#each countries}}
<details class="voting-country-container" countrycode="{{this.code}}">
    <summary>
        <p class="running-order-txt">01</p>
        <img src="/client/resources/images/flags/gr.svg" width="55px">
        <p class="code-txt">{{this.code}}</p>
        <p class="name-txt">{{this.name}}</p>
        <p class="total-votes-txt">{{this.totalVotes}}</p>
        <label class="voting-toggle-switch" id="{{this.code}}-voting-toggle">
            <input type="checkbox" runningorder="{{this.runningOrder}}"  countrycode="{{this.code}}" {{#if this.isVotingOpen}} checked {{/if}}>
            <span class="slider"></span>
        </label>
    </summary>
    <div class="voting-country-content">
        <table class="voting-country-table" id="voting-{{this.code}}-table">
        <tr>
            <th>Judges</th>
            <th colspan="10">Points</th>
        </tr>
        <tr>
            <th></th>
            {{#each ../points}}
            <th>{{this}}</th>
            {{/each}}
        </tr>
        {{#each ../judges}}
        <tr id="{{../this.code}}-{{this.code}}-row">
            <th id="judge-{{this.code}}-header">{{this.name}}</th>
            {{#each ../../points}}
            <th><input type="radio" id="{{../../this.code}}-{{../this.code}}-point{{this}}" name="{{../../this.code}}-{{../this.code}}-chosen-vote" value="{{this}}"></th>
            {{/each}}
            <th><button id="{{../this.code}}-judge-{{this.code}}-update-vote-btn">UPDATE</button></th>
        </tr>
        {{/each}}
        </table>
    </div>
</details>
{{/each}}
`);

adminTemplates.voting.votingCountryContainer.content = {points : points, countries : null, judges : null};

leaderboardTemplates.votingLeaderboardContainer = Handlebars.compile(`
<table id="voting-leaderboard-table">
    <tr>
        <th>R/O</th>
        <th>Country</th>
        {{#each judges}}
        <th>{{this.name}}</th>
        {{/each}}
        <th>Points</th>
        <th>Status</th>
    </tr>
    {{#each countries}}
    <tr countrycode="{{this.code}}" countryname="{{this.name}}">
        <td>{{this.runningOrder}}</th>
        <td>{{this.name}}</th>
        {{#each ../judges}}
        <td id="{{../this.code}}-{{this.code}}-points">0</td>
        {{/each}}
        <td id="{{this.code}}-total-votes">{{this.totalVotes}}</td>
        <td id="{{this.code}}-voting-status" class="closed-voting-status">CLOSED</td>
    </tr>
    {{/each}}
</table>
`);

generalTemplates.notificationBox = Handlebars.compile(`
<div class="notification-box {{this.className}}">
    <div class="left-container">
        <div class="icon-container">
            <i class="material-icons">{{this.icon}}</i>
            <span>{{this.type}}</span>
        </div>
        <div class="message-container">
            <h1 class="notification-message">{{this.message}}</h1>
            <p class="notification-description">{{this.description}}</p>
        </div>
    </div>
    <span class="close-btn">&times;</span>
</div>
`)

export {votingTemplates, registerTemplates, adminTemplates, leaderboardTemplates, generalTemplates};