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
<input type="radio" id="judge-name-{{this.code}}" name="choose-judge" value="{{this.code}}" {{#ifEquals ../judges.length 1}}checked{{/ifEquals}}>
<label for="judge-name-{{this.code}}">
    <div class="judge-content"><div class="online-status-container {{#if this.online}}online{{else}}offline{{/if}}"></div>{{this.name}}</div>
</label>
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
<details class="voting-country-container" countrycode="{{this.code}}" flagcolor1="{{this.flagColors.[0]}}" flagcolor2="{{this.flagColors.[1]}}", flagcolor3="{{this.flagColors.[2]}}">
    <summary style="background-color: {{this.flagColors.[1]}}">
        <div class="left-container">
            <p style="background-color: {{this.flagColors.[1]}}; color: {{this.flagColors.[0]}}">{{this.runningOrder}}</p>
            <img src="/client/resources/images/flags/gr.svg" width="55px">
            <div class="country-name-container">
                <div class="color-container">
                    <div class="color-segment" style="background: linear-gradient( {{this.flagColors.[0]}}, {{this.flagColors.[1]}}, {{this.flagColors.[2]}}, {{this.flagColors.[1]}}, {{this.flagColors.[0]}}"></div>
                    <div class="color-segment" style="background: linear-gradient( {{this.flagColors.[0]}}, {{this.flagColors.[1]}}, {{this.flagColors.[2]}}, {{this.flagColors.[1]}}, {{this.flagColors.[0]}}"></div>
                    <div class="color-segment" style="background: linear-gradient( {{this.flagColors.[0]}}, {{this.flagColors.[1]}}, {{this.flagColors.[2]}}, {{this.flagColors.[1]}}, {{this.flagColors.[0]}}"></div>
                    <div class="color-segment" style="background: linear-gradient( {{this.flagColors.[0]}}, {{this.flagColors.[1]}}, {{this.flagColors.[2]}}, {{this.flagColors.[1]}}, {{this.flagColors.[0]}}"></div>
                    <div class="color-segment" style="background: linear-gradient( {{this.flagColors.[0]}}, {{this.flagColors.[1]}}, {{this.flagColors.[2]}}, {{this.flagColors.[1]}}, {{this.flagColors.[0]}}"></div>
                    <div class="color-segment" style="background: linear-gradient( {{this.flagColors.[0]}}, {{this.flagColors.[1]}}, {{this.flagColors.[2]}}, {{this.flagColors.[1]}}, {{this.flagColors.[0]}}"></div>
                    <div class="color-segment" style="background: linear-gradient( {{this.flagColors.[0]}}, {{this.flagColors.[1]}}, {{this.flagColors.[2]}}, {{this.flagColors.[1]}}, {{this.flagColors.[0]}}"></div>
                    <div class="color-segment" style="background: linear-gradient( {{this.flagColors.[0]}}, {{this.flagColors.[1]}}, {{this.flagColors.[2]}}, {{this.flagColors.[1]}}, {{this.flagColors.[0]}}"></div>
                    <div class="color-segment" style="background: linear-gradient( {{this.flagColors.[0]}}, {{this.flagColors.[1]}}, {{this.flagColors.[2]}}, {{this.flagColors.[1]}}, {{this.flagColors.[0]}}"></div>
                    <div class="color-segment" style="background: linear-gradient( {{this.flagColors.[0]}}, {{this.flagColors.[1]}}, {{this.flagColors.[2]}}, {{this.flagColors.[1]}}, {{this.flagColors.[0]}}"></div>
                    <div class="color-segment" style="background: linear-gradient( {{this.flagColors.[0]}}, {{this.flagColors.[1]}}, {{this.flagColors.[2]}}, {{this.flagColors.[1]}}, {{this.flagColors.[0]}}"></div>
                    <div class="color-segment" style="background: linear-gradient( {{this.flagColors.[0]}}, {{this.flagColors.[1]}}, {{this.flagColors.[2]}}, {{this.flagColors.[1]}}, {{this.flagColors.[0]}}"></div>
                </div>
                <p class="country-name" style="color: {{this.flagColors.[0]}}">{{this.name}}</p>
                <div class="artist-song-container">
                    <p class="song-title">{{this.song}}</p>
                    <p class="artist-name">{{this.artist}}</p>
                </div>
            </div>
        </div>
        <div class="right-container">
            <p class="personal-vote" style="background-color: {{this.flagColors.[0]}}; color: {{this.flagColors.[1]}}">0</p>
            <p class="total-votes" style="color: {{this.flagColors.[0]}}">{{this.totalVotes}}</p>
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
<button class="result-button" id="vote-btn">
<span class="rb-content-container">VOTE</span><span class="rb-status-container"></span>
</button>
`);

votingTemplates.votingContent.content = {points: points};

votingTemplates.votingContent.closedVoting = `
<p class="voting-closed">Voting is now <span>CLOSED</span>!</p>
`

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

<div class="checkbox-input-container" id="admin-container">
    <label for="qualified-cbx">Admin</label>
    <input class="checkbox" type="checkbox" id="admin-cbx" name="admin-cbx">
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
<h2>{{this.originCountry}}</h2>
</div>
{{/each}}
`);

adminTemplates.voting = {};

adminTemplates.voting.votingCountryContainer = Handlebars.compile(`
{{#each countries}}
<details class="admin-voting-country-container" countrycode="{{this.code}}">
    <summary>
        <div class="left-container">
            <p class="running-order-txt">{{this.runningOrder}}</p>
            <img src="/client/resources/images/flags/gr.svg" width="55px">
            <p class="code-txt">{{this.code}}</p>
            <p class="name-txt">{{this.name}}</p>
        </div>
        <div class="right-container">
            <p class="total-votes-txt">{{this.totalVotes}}</p>
            <label class="voting-toggle-switch" id="{{this.code}}-voting-toggle">
                <input type="checkbox" runningorder="{{this.runningOrder}}"  countrycode="{{this.code}}" {{#if this.isVotingOpen}} checked {{/if}}>
                <span class="slider"></span>
            </label>
        </div>
    </summary>
    <div class="admin-voting-country-content">
        <table class="voting-country-table" id="voting-{{this.code}}-table">
            <thead>
                <tr>
                    <th rowspan="2">Judges</th>
                    <th colspan="10">Points</th>
                </tr>
                <tr class="points-caption">
                    {{#each ../points}}
                    <th class="point-caption">{{this}}</th>
                    {{/each}}
                </tr>
            </thead>
            <tbody>
                {{#each ../judges}}
                <tr id="{{../this.code}}-{{this.code}}-row" judgecode="{{this.code}}" countrycode="{{../this.code}}">
                    <th class="judge-name-caption" id="judge-{{this.code}}-header">{{this.name}}</th>
                    {{#each ../../points}}
                    <td>
                        <input type="radio" id="{{../../this.code}}-{{../this.code}}-point{{this}}" name="{{../../this.code}}-{{../this.code}}-chosen-vote" value="{{this}}">
                        <label for="{{../../this.code}}-{{../this.code}}-point{{this}}"><i class="material-icons">check</i></label>
                    </td>
                    {{/each}}
                    <td>
                        <button id="{{../this.code}}-judge-{{this.code}}-update-vote-btn" class="update-vote-btn">UPDATE</button>
                    </td>
                </tr>
                {{/each}}
            </tbody>
        </table>
    </div>
</details>
{{/each}}
`);

adminTemplates.voting.votingCountryContainer.content = {points : points, countries : null, judges : null};

adminTemplates.voting.revealWinnerBoxContainerContent = Handlebars.compile(`
{{#each countries}}
<div class="reveal-winner-country-container">
    <input type="radio" id="{{this.code}}-radio" name="reveal-winner" value="{{this.code}}"/>
    <label for="{{this.code}}-radio"><span class="country-code-txt">{{this.code}}</span> <span class="country-name-txt">{{this.name}}</span></label>
</div>
{{/each}}
`);

leaderboardTemplates.votingLeaderboardContainer = Handlebars.compile(`
<table id="voting-leaderboard-table">
    <thead>
        <tr>
            <th>R/O</th>
            <th>Country</th>
            {{#each judges}}
            <th>{{this.name}}</th>
            {{/each}}
            <th>Points</th>
            <th>Status</th>
        </tr>
    </thead>
    <tbody>
    {{#each countries}}
    <tr countrycode="{{this.code}}" countryname="{{this.name}}">
        <td>{{this.runningOrder}}</th>
        <td>{{this.name}}</th>
        {{#each ../judges}}
        <td class="points-txt" id="{{../this.code}}-{{this.code}}-points">0</td>
        {{/each}}
        <td class="total-votes-txt" id="{{this.code}}-total-votes">{{this.totalVotes}}</td>
        <td id="{{this.code}}-voting-status" class="closed-voting-status">CLOSED</td>
    </tr>
    {{/each}}
    </tbody>
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
`);

generalTemplates.errorBox = Handlebars.compile(`
<div class="error-box">

    <div class="top-container">
        <div class="icon-container">
            <i class="material-icons">error</i>
            <span>Error</span>
        </div>
        <div class="message-container">
            <h1 class="error-message">{{this.message}}</h1>
            <p class="error-description">{{this.description}}</p>
        </div>
        <span class="close-btn">&times;</span>
    </div>

    <div class="bottom-container">
        <details class="error-details-container">
            <summary>More information</summary>
            <div class="error-details-content">
                <p class="error-caption">Stack trace:</p>
                <p class="error-text">{{this.stackTrace}}</p>
                <button class="copy-btn">Copy</button>
                <p class="error-caption">Error type:</p>
                <p class="error-text">{{this.type}}</p>
            </div>
        </details>
        <details class="error-details-container help-container" open>
            <summary>Help</summary>
            <div class="error-details-content">
                <p class="error-caption">Try the following:</p>
                <p class="error-text">{{this.help}}</p>
                <a class="reload-page-link" href="{{this.link}}">Reload Page</a>
            </div>
        </details>
    </div>
</div>
`);

generalTemplates.confirmDialog = Handlebars.compile(`
<div class="confirm-dialog">
    <div class="top-container">
        <div class="icon-container">
            <i class="material-icons">info</i>
            <p>Confirm your action</p>
        </div>
        <span class="close-btn">&times;</span>
    </div>
    <div class="bottom-container">
        <p class="confirm-message">{{this.message}}</h1>
        <div class="buttons-area">
            <button class="yes-btn">YES</button>
            <button class="no-btn">NO</button>
        </div>
    </div>
</div>
`);

generalTemplates.messageDialog = Handlebars.compile(`
<div class="message-dialog {{this.className}}">
    <div class="top-container">
        <div class="icon-container">
            <i class="material-icons">{{this.icon}}</i>
            <p>{{this.caption}}</p>
        </div>
        <div class="right-container">
            <div class="timer-container">
                <p class="timer-caption">Reloading after</p>
                <p class="timer-txt"><span class="timer-seconds-txt">5</span> s</p>
            </div>
            <span class="close-btn">&times;</span>
        </div>
    </div>
    <div class="bottom-container">
        <p class="message">{{this.message}}</p>
        <div class="buttons-area">
            <button class="ok-btn">OK</button>
        </div>
    </div>
</div>
`)

export {votingTemplates, registerTemplates, adminTemplates, leaderboardTemplates, generalTemplates};