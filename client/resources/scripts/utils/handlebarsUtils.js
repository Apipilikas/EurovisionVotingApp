var templates = {};

Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

templates.judges = Handlebars.compile(`
{{#each judges}}
<input type="radio" id="judge-name-{{@index}}" name="choose-judge" value="{{this.name}}" {{#ifEquals ../judges.length 1}}checked{{/ifEquals}}>
<label for="judge-name-{{@index}}">{{this.name}}</label>
{{/each}}
`)

templates.countries = Handlebars.compile(`
{{#each countries}}
<details class="country-container">
<summary>{{this.name}}</summary>
<div class="country-content"></div>
</details>
{{/each}}
`)

export {templates};